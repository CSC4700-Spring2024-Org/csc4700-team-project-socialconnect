import React,{useState,useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar, { SidebarItem } from '../components/Sidebar';
import { IoHome, IoAnalytics } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { FaCalendarAlt, FaNewspaper } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom'

const Layout = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Home');
  const location = useLocation();

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
      default:
        setActiveItem('');
        break;
    }
  }, [location.pathname]);

  return (
    <>
        <Header />
        <div style={{width:'100%',height:'100%',display:'flex'}}>
          <Sidebar className='sidebar'>
            <SidebarItem icon={<IoHome size={20} />} text="Home" active={activeItem === 'Home'} onClick={() => {navigate('/');setActiveItem('Home')}}/>
            <SidebarItem icon={<IoAnalytics size={20} />} text="Analytics" active={activeItem === 'Analytics'} onClick={() => {setActiveItem('Analytics');navigate('/analytics');}}/>
            <SidebarItem icon={<CiSquarePlus size={20} />} text="Post" active={activeItem === 'Post'} onClick={() => {navigate('/post');setActiveItem('Post')}}/>
            <SidebarItem icon={<FaCalendarAlt size={20} />} text="Calendar" active={activeItem === 'Calendar'} onClick={() => {navigate('/calendar');setActiveItem('Calendar')}}/>
          </Sidebar>
          <Outlet />
        </div>
    </>
  )
}

export default Layout