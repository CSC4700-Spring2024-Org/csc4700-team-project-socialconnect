import React, {useState, useEffect} from 'react'
import '../Styles/Profile.css'
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../features/authSlice';
import { setInstagram, tiktokLogout } from '../features/authSlice';
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
    
    const buildURL = async() => {
      const url = await instaService.tiktokInitializeLogin()
      const loginWindow = window.open(url, "_blank", "width=500,height=700,resizable=yes,scrollbars=yes")

      
      // window.addEventListener("message", (event) => {
      //   console.log(event)
      //   console.log(event.data)
      //   if (event.origin === "https://danbfrost.com" && !event.data.error) {
      //     console.log("HELLO")
      //     loginWindow.close()
      //   }
      // });

      // loginWindow.addEventListener("message", (event) => {
      //   console.log(event)
      //   console.log(event.data)
      //   if (event.origin === "https://danbfrost.com" && !event.data.error) {
      //     console.log("HELLO")
      //     loginWindow.close()
      //   }
      // });
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
                            {!user || (user && !user.instagramConnected) ? <button onClick={logInToFB}>Connect</button> :
                              <button onClick={logOutOfFB}>Logout</button>}
                        </div>
                        <div className='tiktok-connect'>
                            <FaTiktok className='tiktok-icon'/>
                            <span>TikTok</span>
                            {!user || (user && !user.tiktokConnected) ? <button onClick={buildURL}>Connect</button> :
                              <button onClick={() => dispatch(tiktokLogout())}>Logout</button>}
                        </div>
                        <div className='youtube-connect'>
                            <FaYoutube className='youtube-icon' color='red'/>
                            <span>YouTube</span>
                            <button>Connect</button>
                        </div>
                        <div className='twitter-connect'>
                            <FaSquareXTwitter className='twitter-icon'/>
                            <span>X</span>
                            <button>Connect</button>
                        </div>
                    </div>
                </div>
            </div> : <></>}
        </>
    )
}

export default Profile