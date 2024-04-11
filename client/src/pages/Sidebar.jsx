// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/analytics">Analytics</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
        {/* Add more links for other pages */}
      </ul>
    </div>
  );
};

export default Sidebar;
