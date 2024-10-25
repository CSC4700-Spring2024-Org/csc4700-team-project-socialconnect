import React, {useState, useEffect} from 'react'
import '../Styles/Profile.css'
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../features/authSlice';
import { setInstagram } from '../features/authSlice';
import sha256 from 'crypto-js/sha256'
import hex from 'crypto-js/enc-hex'
import instaService from '../features/instaService';

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
 
    const { user, isLoading, isError, isSuccess } = useSelector(
       (state) => state.auth
    )

    const [initialRenderCompleted, setInitialRenderCompleted] = useState(false);

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

    function generateRandomString(length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    const buildURL = async() => {
      // const csrfState = `${Math.random().toString(36).substring(2)}-${user.id}`;
      // document.cookie = `csrfState=${csrfState}; HttpOnly; path=/; secure; samesite=strict`;

      // const code_challenge = sha256(generateRandomString(Math.random()*85 + 43)).toString(hex)
      
      // let url = 'https://www.tiktok.com/v2/auth/authorize/?';
      // const redirect_uri = 'https://api.danbfrost.com:443/api/tiktokCallback/'
      // url += `client_key=${process.env.REACT_APP_TIKTOK_CLIENT_KEY}`
      // url += '&scope=user.info.basic,user.info.profile,user.info.stats,video.publish'
      // url += '&response_type=code'
      // url += `&redirect_uri=${redirect_uri}`
      // url += `&state=${csrfState}`
      // url += `&code_challenge=${code_challenge}`
      // url += '&code_challenge_method=S256'
      // return url
      const url = await instaService.tiktokInitializeLogin()
      window.open(url, "_blank", "width=500,height=700,resizable=yes,scrollbars=yes")
    }

    return (
        <>
            {!isLoading ? <div className="account-page">
                <div className='profile-sidebar'>
                    <div className='sidebar-item'>Apps and Accounts</div>
                    <div className='sidebar-item'>My posts</div>
                </div>
                <div className='connections-container'>
                    <h2 className='connections-header'>Apps and Accounts</h2>
                    <div className='connections'>
                        <div className='instagram-connect'>
                            <FaInstagram className='insta-icon' color='#ff00ff'/>
                            <span>Instagram</span>
                            {!user || (user && !user.instaRefresh) ? <button onClick={logInToFB}>Connect</button> :
                              <button onClick={logOutOfFB}>Logout</button>}
                        </div>
                        <div className='tiktok-connect'>
                            <FaTiktok className='tiktok-icon'/>
                            <span>Tiktok</span>
                            <button onClick={buildURL}>Connect</button>
                        </div>
                        <div className='youtube-connect'>
                            <FaYoutube className='youtube-icon' color='red'/>
                            <span>Youtube</span>
                            <button>Connect</button>
                        </div>
                        <div className='twitter-connect'>
                            <FaSquareXTwitter className='twitter-icon'/>
                            <span>Twitter</span>
                            <button>Connect</button>
                        </div>
                    </div>
                </div>
            </div> : <></>}
        </>
    )
}

export default Profile