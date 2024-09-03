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
                            <button>Connect</button>
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