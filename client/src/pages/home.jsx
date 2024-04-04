import React from 'react';
import '/Users/joeylamanna/Desktop/csc4700-team-project-socialconnect/client/src/Styles/Dashboard.css';
import Sidebar from '/Users/joeylamanna/Desktop/csc4700-team-project-socialconnect/client/src/pages/Sidebar.jsx'
import CommentSection from './CommentSection';

const home = () => {
  return (
    <div className="dashboard">
      <Sidebar/>
      <div className="box">Box 1 </div>
      <div className="box">Box 2</div>
      <div className="comment"> <CommentSection /></div>
      <div className="box">Box 4</div>
    </div>
  );
};

export default home