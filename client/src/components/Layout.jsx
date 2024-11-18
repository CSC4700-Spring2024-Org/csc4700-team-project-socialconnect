import React,{useState,useEffect} from 'react';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { IoHome, IoAnalytics } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { CgProfile } from 'react-icons/cg'
import { CiLogout } from "react-icons/ci";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

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
      case '/profile':
        setActiveItem('Profile')
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
            <SidebarItem icon={<CiSquarePlus size={20} />} text="Post" active={activeItem === 'Post'} onClick={() => {setActiveItem('Post');navigate('/post')}}/>
            <SidebarItem icon={<FaCalendarAlt size={20} />} text="Calendar" active={activeItem === 'Calendar'} onClick={() => {setActiveItem('Calendar');navigate('/calendar')}}/>
            <SidebarItem icon={<CgProfile size={20} />} text="Profile" active={activeItem === 'Profile'} onClick={() => {setActiveItem('Profile');navigate('/profile')}}/>
            <SidebarItem icon={<CiLogout size={20} />} text="Logout" active={activeItem === 'Logout'} onClick={() => {dispatch(logout());navigate('/login')}}/>
          </Sidebar>
          <Outlet />
        </div>
    </>
  )
  
};

export default Layout