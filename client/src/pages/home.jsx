import React from 'react';
import '/Users/joeylamanna/Desktop/csc4700-team-project-socialconnect/client/src/Styles/Dashboard.css';
import Sidebar from '/Users/joeylamanna/Desktop/csc4700-team-project-socialconnect/client/src/pages/Sidebar.jsx'
import CommentSection from './CommentSection';
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../features/authSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getUser())
    }
  }, []);

  useEffect(() => {
    if (isSuccess && user) {
      navigate('/')
    } else if (!isLoading && (isError || (!isSuccess && !user))) {
      navigate('/login')
    }
  }, [user, isSuccess, isError, navigate, isLoading]);
  
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

export default Home