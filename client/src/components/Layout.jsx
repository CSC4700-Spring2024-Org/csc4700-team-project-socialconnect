import React,{useState,useEffect} from 'react';
<<<<<<< HEAD
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { IoHome, IoAnalytics } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { CgProfile } from 'react-icons/cg'
import { CiLogout } from "react-icons/ci";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
=======
import Header from './Header';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { IoHome, IoAnalytics } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { FaCalendarAlt, FaLock, FaFileAlt } from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467

const Layout = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Home');
  const location = useLocation();
  const dispatch = useDispatch()

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setActiveItem('Home');
        break;
      case '/analytics':
        setActiveItem('Analytics');
        break;
      case '/post':
        setActiveItem('Post');
        break;
      case '/calendar':
        setActiveItem('Calendar');
        break;
<<<<<<< HEAD
      case '/profile':
        setActiveItem('Profile')
=======
      case '/privacypolicy':
        setActiveItem('Privacy Policy');
        break;
      case '/termsandconditions':
        setActiveItem('Terms and Conditions');
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
        break;
      default:
        setActiveItem('');
        break;
    }
  }, [location.pathname]);

  return (
    <>
        {/* <Header /> */}
        <div style={{width:'100%',height:'100%',display:'flex'}}>
          <Sidebar className='sidebar'>
            <SidebarItem icon={<IoHome size={20} />} text="Home" active={activeItem === 'Home'} onClick={() => {setActiveItem('Home');navigate('/')}}/>
            <SidebarItem icon={<IoAnalytics size={20} />} text="Analytics" active={activeItem === 'Analytics'} onClick={() => {setActiveItem('Analytics');navigate('/analytics');}}/>
<<<<<<< HEAD
            <SidebarItem icon={<CiSquarePlus size={20} />} text="Post" active={activeItem === 'Post'} onClick={() => {setActiveItem('Post');navigate('/post')}}/>
            <SidebarItem icon={<FaCalendarAlt size={20} />} text="Calendar" active={activeItem === 'Calendar'} onClick={() => {setActiveItem('Calendar');navigate('/calendar')}}/>
            <SidebarItem icon={<CgProfile size={20} />} text="Profile" active={activeItem === 'Profile'} onClick={() => {setActiveItem('Profile');navigate('/profile')}}/>
            <SidebarItem icon={<CiLogout size={20} />} text="Logout" active={activeItem === 'Logout'} onClick={() => {dispatch(logout());navigate('/login')}}/>
=======
            <SidebarItem icon={<CiSquarePlus size={20} />} text="Post" active={activeItem === 'Post'} onClick={() => {navigate('/post');setActiveItem('Post')}}/>
            <SidebarItem icon={<FaCalendarAlt size={20} />} text="Calendar" active={activeItem === 'Calendar'} onClick={() => {navigate('/calendar');setActiveItem('Calendar')}}/>
            <SidebarItem icon={<FaLock size={20} />} text="Privacy Policy" active={activeItem === 'Privacy Policy'} onClick={() => {navigate('/privacypolicy');setActiveItem('Privacy Policy')}}/>
            <SidebarItem icon={<FaFileAlt size={20} />} text="Terms and Conditions" active={activeItem === 'Terms and Conditions'} onClick={() => {navigate('/termsandconditions');setActiveItem('Terms and Conditions')}}/>
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
          </Sidebar>
          <Outlet />
        </div>
    </>
  )
  
};

export default Layout