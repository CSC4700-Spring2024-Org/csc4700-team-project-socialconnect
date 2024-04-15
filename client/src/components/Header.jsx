import React, { useState } from 'react'
import '../Styles/Header.css'
import { CgProfile } from 'react-icons/cg'
import { logout } from '../features/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <header className='header'>
        Social Connect
          <CgProfile className='profileIcon' onClick={() => setOpen(!open)}/>
      </header>
      <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
        <ul>
          <li className='dropdownItem'>
            <a>My profile</a>
          </li>
          <li className='dropdownItem'>
            <a onClick={() => {dispatch(logout()); navigate('/login')}}>Logout</a>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Header