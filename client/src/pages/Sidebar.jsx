// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

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
          <Link to="/post">Post</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
