import React from 'react'
import '../Styles/Profile.css'
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";

const Profile = () => {
  return (
    <div className="account-page">
        <div className='profile-sidebar'>
            <div className='sidebar-item'>My account</div>
            <div className='sidebar-item'>My posts</div>
        </div>
        <div className='connections-container'>
            <h2 className='connections-header'>Apps and Accounts</h2>
            <div className='connections'>
                <div className='instagram-connect'>
                    <FaInstagram className='insta-icon' color='#ff00ff'/>
                    <span>Instagram</span>
                    <button>Connect</button>
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
    </div>
  )
}

export default Profile