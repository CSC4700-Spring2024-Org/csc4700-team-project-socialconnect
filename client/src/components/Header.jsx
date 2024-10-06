import React, { useState } from 'react'
import '../Styles/Header.css'
import { CgProfile } from 'react-icons/cg'
import { logout } from '../features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SocialConnectLogo from '../SocialConnectLogo.png'

const Header = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading} = useSelector(
    (state) => state.auth
 )

  return (
    <>
      {!isLoading ? <>
        <header className='header'>
            <img src={SocialConnectLogo} onClick={() => {navigate('/')}}></img>
            <CgProfile className='profileIcon' onClick={() => setOpen(!open)}/>
        </header>
        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
          <ul className='dropdown-item-list'>
            <li className='dropdownItem'>
              <span onClick={() => {setOpen(!open); navigate('/profile')}}>My profile</span>
            </li>
            <li className='dropdownItem'>
              <span onClick={() => {dispatch(logout()); navigate('/login')}}>Logout</span>
            </li>
          </ul>
        </div>
      </> : <></>}
    </>
  )
}

export default Header