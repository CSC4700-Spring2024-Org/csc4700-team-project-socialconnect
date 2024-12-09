import React, {useState, useEffect} from 'react'
import '../Styles/Profile.css'
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, youtubeLogout } from '../features/authSlice';
import { setInstagram, tiktokLogout } from '../features/authSlice';
import instaService from '../features/instaService';
import { toast } from 'react-toastify';

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess } = useSelector(
       (state) => state.auth
    )

    const [initialRenderCompleted, setInitialRenderCompleted] = useState(false);
    const [activeItem, setActiveItem] = useState('Apps')

    useEffect(() => {
      if (!user) {
        dispatch(getUser()).finally(() => {
          setInitialRenderCompleted(true);
        });
      } else {
        setInitialRenderCompleted(true);
      }
    }, []);
  
    useEffect(() => {
      if (initialRenderCompleted && !isLoading) {
        if (isSuccess && user) {
          navigate('/profile');
        } else if (isError || (!isSuccess && !user)) {
          navigate('/login');
        }
      }
    }, [user, isSuccess, isError, navigate, isLoading, initialRenderCompleted]);


    return (
        <>
            {!isLoading ? <div className="account-page">
                <div className='profile-sidebar'>
                    <div className='sidebar-item' onClick={() => setActiveItem('Apps')}>My Accounts</div>
                    <div className='sidebar-item' onClick={() => setActiveItem('Terms')}>Terms and Conditions</div>
                    <div className='sidebar-item' onClick={() => setActiveItem('Privacy')}>Privacy Policy</div>
                </div>
                <ProfileItem activeItem={activeItem} dispatch={dispatch} user={user}/>
            </div> : <></>}
        </>
    )
}

const ProfileItem = ({activeItem, dispatch, user}) => {
  const logInToFB = () => {
    window.FB.login(
      (response) => {
        dispatch(setInstagram(response.authResponse?.accessToken));
      },
      {
        config_id: '456270036836614',
      }
    );
  };

  const logOutOfFB = () => {
    window.FB.logout(() => {
      dispatch(setInstagram(null));
    });
  };
  
  const buildURL = async() => {
    const url = await instaService.tiktokInitializeLogin()
    const loginWindow = window.open(url, "_blank", "width=500,height=700,resizable=yes,scrollbars=yes")

    const handleTikTokMessage = (event) => {
      if (event.origin !== "https://api.danbfrost.com") return;
      const { success, updatedUser } = event.data;

      if (success) {
        dispatch(updateUser(updatedUser))
        loginWindow.close()
      } else {
        toast.error("Something went wrong logging in to TikTok")
        loginWindow.close()
      }
      window.removeEventListener("message", handleTikTokMessage);
    }

    window.addEventListener("message", handleTikTokMessage);
  }

  const buildYoutubeURL = async() => {
    const url = await instaService.youtubeInitializeLogin()
    const loginWindow = window.open(url, "_blank", "width=500, height=700, resizable=yes, scrollbars=yes")

    const handleYouTubeMessage = (event) => {
      if (event.origin !== "https://api.danbfrost.com") return;
      const { success, updatedUser } = event.data;

      if (success) {
        dispatch(updateUser(updatedUser))
        loginWindow.close()
      } else {
        toast.error("Something went wrong logging in to Youtube")
        loginWindow.close()
      }
      window.removeEventListener("message", handleYouTubeMessage);
    }

    window.addEventListener("message", handleYouTubeMessage);
  }

  if (activeItem === 'Apps') {
    return (
      <div className='connections-container'>
        <h1 className='connections-header'>My Accounts</h1>
        <div className='connections'>
            <div className={`instagram-connect ${user && user.instagramConnected ? 'connected' : 'disconnected'}`}>
              <h2>Instagram</h2>
              <FaInstagram className='insta-icon' color='#ff00ff'/>
              {!user || (user && !user.instagramConnected) 
                  ? <button style={{marginTop: '5%'}} onClick={logInToFB}>Connect</button> 
                  : <button style={{marginTop: '5%'}} onClick={logOutOfFB}>Logout</button>}
            </div>

            <div className={`tiktok-connect ${user && user.tiktokConnected ? 'connected' : 'disconnected'}`}>
                <h2>TikTok</h2>
                <FaTiktok className='tiktok-icon'/>
                {!user || (user && !user.tiktokConnected) 
                    ? <button style={{marginTop: '5%'}} onClick={buildURL}>Connect</button> 
                    : <button style={{marginTop: '5%'}} onClick={() => dispatch(tiktokLogout())}>Logout</button>}
            </div>
            <div className={`youtube-connect ${user && user.youtubeConnected ? 'connected' : 'disconnected'}`}>
                <h2>YouTube</h2>
                <FaYoutube className='youtube-icon' color='red'/>
                {!user || (user && !user.youtubeConnected) 
                    ? <button style={{marginTop: '5%'}} onClick={buildYoutubeURL}>Connect</button> 
                    : <button style={{marginTop: '5%'}} onClick={() => dispatch(youtubeLogout())}>Logout</button>}
            </div>

            <div className={`x-connect ${user && user.xConnected ? 'connected' : 'disconnected'}`}>
                <h2>X</h2>
                <FaSquareXTwitter className={`profile-platform-icon ${user && user.xConnected ? 'connected' : 'disconnected'}`}/>
                <button style={{marginTop: '5%'}}>Connect</button>
            </div>

        </div>
      </div>
    )
  } else if (activeItem === 'Terms') {
    return (
      <div className='profile-terms-container'>
        {/* <div className='terms-content-profile-page'> */}
          <h1>Terms and Conditions</h1>

          <h2>Agreement between User and https://www.danbfrost.com </h2>
          <p>Welcome to https://www.danbfrost.com. The https://www.danbfrost.com website (the "Site") is comprised of various web pages operated by Social Connect. https://www.danbfrost.com is offered to you conditioned on your acceptance without modification of the terms, conditions, and notices contained herein (the "Terms"). Your use of https://www.danbfrost.com constitutes your agreement to all such Terms. Please read these terms carefully, and keep a copy of them for your reference.</p>
          <p>https://www.danbfrost.com is a social media account management Site. </p>
          <p>Social Connect allows users to connect all of their social media accounts. Content creators can then view their posts, analytics, comments, and posting schedules. Creators can make posts and apply to comments to multiple platforms all in one place. </p>
          <h2>Privacy</h2>
          <p>Your use of https://www.danbfrost.com is subject to Social Connect's Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices. </p>
          <h2>Electronic Communications</h2>
          <p>Visiting https://www.danbfrost.com or sending emails to Social Connect constitutes electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communications be in writing. </p>
          <h2>Your Account</h2>
          <p>If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity. You acknowledge that Social Connect is not responsible for third party access to your account that results from theft or misappropriation of your account. Social Connect and its associates reserve the right to refuse or cancel service, terminate accounts, or remove or edit content in our sole discretion. </p>
          <h2>Children Under Thirteen</h2>
          <p>Social Connect does not knowingly collect, either online or offline, personal information from persons under the age of thirteen. If you are under 18, you may use https://www.danbfrost.com only with permission of a parent or guardian. </p>
          <h2>Links to Third Party Sites/Third Party Services</h2>
          <p>https://www.danbfrost.com may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of Social Connect and Social Connect is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. Social Connect is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by Social Connect of the site or any association with its operators. </p>
          <p>Certain services made available via https://www.danbfrost.com are delivered by third party sites and organizations. By using any product, service or functionality originating from the https://www.danbfrost.com domain, you hereby acknowledge and consent that Social Connect may share such information and data with any third party with whom Social Connect has a contractual relationship to provide the requested product, service or functionality on behalf of https://www.danbfrost.com users and customers.</p>
          <h2>No Unlawful or Prohibited Use/Intellectual Property</h2>
          <p>You are granted a non-exclusive, non-transferable, revocable license to access and use https://www.danbfrost.com strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to Social Connect that you will not use the Site for any purpose that is unlawful or prohibited by these Terms. You may not use the Site in any manner which could damage, disable, overburden, or impair the Site or interfere with any other party's use and enjoyment of the Site. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Site. </p>
          <p>All content included as part of the Service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Site, is the property of Social Connect or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights. You agree to observe and abide by all copyright and other proprietary notices, legends or other restrictions contained in any such content and will not make any changes thereto.</p>
          <p>You will not modify, publish, transmit, reverse engineer, participate in the transfer or sale, create derivative works, or in any way exploit any of the content, in whole or in part, found on the Site. Social Connect content is not for resale. Your use of the Site does not entitle you to make any unauthorized use of any protected content, and in particular you will not delete or alter any proprietary rights or attribution notices in any content. You will use protected content solely for your personal use, and will make no other use of the content without the express written permission of Social Connect and the copyright owner. You agree that you do not acquire any ownership rights in any protected content. We do not grant you any licenses, express or implied, to the intellectual property of Social Connect or our licensors except as expressly authorized by these Terms.</p>
          <h2>Use of Communication Services</h2>
          <p>The Site may contain bulletin board services, chat areas, news groups, forums, communities, personal web pages, calendars, and/or other message or communication facilities designed to enable you to communicate with the public at large or with a group (collectively, "Communication Services"). You agree to use the Communication Services only to post, send and receive messages and material that are proper and related to the particular Communication Service.</p>
          <p>By way of example, and not as a limitation, you agree that when using a Communication Service, you will not: defame, abuse, harass, stalk, threaten or otherwise violate the legal rights (such as rights of privacy and publicity) of others; publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topic, name, material or information; upload files that contain software or other material protected by intellectual property laws (or by rights of privacy of publicity) unless you own or control the rights thereto or have received all necessary consents; upload files that contain viruses, corrupted files, or any other similar software or programs that may damage the operation of another's computer; advertise or offer to sell or buy any goods or services for any business purpose, unless such Communication Service specifically allows such messages; conduct or forward surveys, contests, pyramid schemes or chain letters; download any file posted by another user of a Communication Service that you know, or reasonably should know, cannot be legally distributed in such manner; falsify or delete any author attributions, legal or other proper notices or proprietary designations or labels of the origin or source of software or other material contained in a file that is uploaded; restrict or inhibit any other user from using and enjoying the Communication Services; violate any code of conduct or other guidelines which may be applicable for any particular Communication Service; harvest or otherwise collect information about others, including e-mail addresses, without their consent; violate any applicable laws or regulations.</p>
          <p>Social Connect has no obligation to monitor the Communication Services. However, Social Connect reserves the right to review materials posted to a Communication Service and to remove any materials in its sole discretion. Social Connect reserves the right to terminate your access to any or all of the Communication Services at any time without notice for any reason whatsoever.</p>
          <p>Social Connect reserves the right at all times to disclose any information as necessary to satisfy any applicable law, regulation, legal process or governmental request, or to edit, refuse to post or to remove any information or materials, in whole or in part, in Social Connect's sole discretion.</p>
          <p>Always use caution when giving out any personally identifying information about yourself or your children in any Communication Service. Social Connect does not control or endorse the content, messages or information found in any Communication Service and, therefore, Social Connect specifically disclaims any liability with regard to the Communication Services and any actions resulting from your participation in any Communication Service. Managers and hosts are not authorized Social Connect spokespersons, and their views do not necessarily reflect those of Social Connect.</p>
          <p>Materials uploaded to a Communication Service may be subject to posted limitations on usage, reproduction and/or dissemination. You are responsible for adhering to such limitations if you upload the materials.</p>
          <h2>Materials Provided to https://www.danbfrost.com or Posted on Any Social Connect Web Page</h2>
          <p>Social Connect does not claim ownership of the materials you provide to https://www.danbfrost.com (including feedback and suggestions) or post, upload, input or submit to any Social Connect Site or our associated services (collectively "Submissions"). However, by posting, uploading, inputting, providing or submitting your Submission you are granting Social Connect, our affiliated companies and necessary sublicensees permission to use your Submission in connection with the operation of their Internet businesses including, without limitation, the rights to: copy, distribute, transmit, publicly display, publicly perform, reproduce, edit, translate and reformat your Submission; and to publish your name in connection with your Submission.</p>
          <p>No compensation will be paid with respect to the use of your Submission, as provided herein. Social Connect is under no obligation to post or use any Submission you may provide and may remove any Submission at any time in Social Connect's sole discretion.</p>
          <p>By posting, uploading, inputting, providing or submitting your Submission you warrant and represent that you own or otherwise control all of the rights to your Submission as described in this section including, without limitation, all the rights necessary for you to provide, post, upload, input or submit the Submissions.</p>
          <h2>Third Party Accounts</h2>
          <p>You will be able to connect your Social Connect account to third party accounts. By connecting your Social Connect account to your third party account, you acknowledge and agree that you are consenting to the continuous release of information about you to others (in accordance with your privacy settings on those third party sites). If you do not want information about you to be shared in this manner, do not use this feature.</p>
          <h2>International Users</h2>
          <p>The Service is controlled, operated and administered by Social Connect from our offices within the USA. If you access the Service from a location outside the USA, you are responsible for compliance with all local laws. You agree that you will not use the Social Connect Content accessed through https://www.danbfrost.com in any country or in any manner prohibited by any applicable laws, restrictions or regulations.</p>
          <h2>Indemnification</h2>
          <p>You agree to indemnify, defend and hold harmless Social Connect, its officers, directors, employees, agents and third parties, for any losses, costs, liabilities and expenses (including reasonable attorney's fees) relating to or arising out of your use of or inability to use the Site or services, any user postings made by you, your violation of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable laws, rules or regulations. Social Connect reserves the right, at its own cost, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with Social Connect in asserting any available defenses.</p>
          <h2>Liability Disclaimer</h2>
          <p>THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. SOCIAL CONNECT AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.</p>
          <p>SOCIAL CONNECT AND/OR ITS SUPPLIERS MAKE NO REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY, TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE PROVIDED "AS IS" WITHOUT WARRANTY OR CONDITION OF ANY KIND. SOCIAL CONNECT AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.</p>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SOCIAL CONNECT AND/OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SITE, WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED THROUGH THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE SITE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, EVEN IF SOCIAL CONNECT OR ANY OF ITS SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. BECAUSE SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.</p>
          <h2>Termination/Access Restriction</h2>
          <p>Social Connect reserves the right, in its sole discretion, to terminate your access to the Site and the related services or any portion thereof at any time, without notice. To the maximum extent permitted by law, this agreement is governed by the laws of the Commonwealth of Pennsylvania and you hereby consent to the exclusive jurisdiction and venue of courts in Pennsylvania in all disputes arising out of or relating to the use of the Site. Use of the Site is unauthorized in any jurisdiction that does not give effect to all provisions of these Terms, including, without limitation, this section.</p>
          <p>You agree that no joint venture, partnership, employment, or agency relationship exists between you and Social Connect as a result of this agreement or use of the Site. Social Connect's performance of this agreement is subject to existing laws and legal process, and nothing contained in this agreement is in derogation of Social Connect's right to comply with governmental, court and law enforcement requests or requirements relating to your use of the Site or information provided to or gathered by Social Connect with respect to such use. If any part of this agreement is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the agreement shall continue in effect.</p>
          <p>Unless otherwise specified herein, this agreement constitutes the entire agreement between the user and Social Connect with respect to the Site and it supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written, between the user and Social Connect with respect to the Site. A printed version of this agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. It is the express wish to the parties that this agreement and all related documents be written in English.</p>
          <h2>Changes to Terms</h2>
          <p>Social Connect reserves the right, in its sole discretion, to change the Terms under which https://www.danbfrost.com is offered. The most current version of the Terms will supersede all previous versions. Social Connect encourages you to periodically review the Terms to stay informed of our updates.</p>
          <h2>Contact Us</h2>
          <p>Social Connect welcomes your questions or comments regarding the Terms:</p>

          <footer className='terms-footer'>
          Effective as of September 30, 2024    |    Contact: socialconnectbiznuz@gmail.com
        </footer>
        {/* </div> */}
      </div>
    )
  } else {
    return (
      <div className='profile-terms-container'>
        <h1>Privacy Policy</h1>
        <p>This Privacy Policy ("Policy") applies to https://www.danbfrost.com and Social Connect ("Company") and governs data collection and usage. For the purposes of this Privacy Policy, unless otherwise noted, all references to the Company include https://www.danbfrost.com. The Company's website is a social media account management site. By using the Company website, you consent to the data practices described in this statement.</p>

        <h2>Collection of your Personal Information</h2>
        <p>Please keep in mind that if you directly disclose personally identifiable information or personally sensitive data through the Company's public message boards, this information may be collected and used by others.</p>
        <p>We do not collect any personal information about you unless you voluntarily provide it to us. However, you may be required to provide certain personal information to us when you elect to use certain products or services. These may include:</p>
        <ul>
          <li>Registering for an account</li>
          <li>Entering a sweepstakes or contest sponsored by us or one of our partners</li>
          <li>Signing up for special offers from selected third parties</li>
          <li>Sending us an email message</li>
          <li>Submitting your credit card or other payment information when ordering and purchasing products and services</li>
        </ul>
        <p>We also may gather additional personal or non-personal information in the future.</p>

        <h2>Sharing Information with Third Parties</h2>
        <p>The Company does not sell, rent, or lease its customer lists to third parties.</p>
        <p>The Company may share data with trusted partners to help perform statistical analysis, send you email or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services to the Company, and they are required to maintain the confidentiality of your information.</p>
        <p>The Company may disclose your personal information, without notice, if required to do so by law or in the good faith belief that such action is necessary to:</p>
        <ul>
          <li>Conform to the edicts of the law or comply with legal process served on the Company or the site</li>
          <li>Protect and defend the rights or property of the Company</li>
          <li>Act under exigent circumstances to protect the personal safety of users of the Company or the public</li>
        </ul>

        <h2>Automatically Collected Information</h2>
        <p>The Company may automatically collect information about your computer hardware and software. This information can include your IP address, browser type, domain names, access times, and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding the use of the Company's website.</p>

        <h2>Links</h2>
        <p>This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.</p>

        <h2>Right to Deletion</h2>
        <p>Subject to certain exceptions set out below, on receipt of a verifiable request from you, we will:</p>
        <ul>
          <li>Delete your personal information from our records</li>
          <li>Direct any service providers to delete your personal information from their records</li>
        </ul>
        <p>Please note that we may not be able to comply with requests to delete your personal information if it is necessary to:</p>
        <ul>
          <li>Complete the transaction for which the personal information was collected</li>
          <li>Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity; or prosecute those responsible for that activity</li>
          <li>Debug to identify and repair errors that impair existing intended functionality</li>
          <li>Exercise free speech, ensure the right of another consumer to exercise their right of free speech</li>
          <li>Comply with an existing legal obligation</li>
          <li>Otherwise use your personal information, internally, in a lawful manner that is compatible with the context in which you provided the information</li>
        </ul>

        <h2>Children Under Thirteen</h2>
        <p>The Company does not knowingly collect personally identifiable information from children under the age of 13. If you are under the age of 13, you must ask your parent or guardian for permission to use this website.</p>

        <h2>Disconnecting your Company's Account from Third Party Websites</h2>
        <p>You will be able to connect your Company's account to third-party accounts. By connecting your Company account to your third-party account, you acknowledge and agree to the continuous release of information about you to others in accordance with your privacy settings on those third-party sites. If you do not want information about you to be shared in this manner, do not use this feature. You may disconnect your account from a third-party account at any time.</p>

        <h2>Email Communications</h2>
        <p>From time to time, the Company may contact you via email for the purpose of providing announcements, promotional offers, alerts, confirmations, surveys, and/or other general communication.</p>

        <h2>Changes to This Statement</h2>
        <p>The Company reserves the right to change this Policy from time to time. When changes to this Policy are significant, we will inform you by sending a notice via email or placing a prominent notice on our website.</p>
        <footer className='terms-footer'>
          Effective as of September 30, 2024    |    Contact: socialconnectbiznuz@gmail.com
        </footer>
      </div>
    )
  }
}

export default Profile