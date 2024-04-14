import '../Styles/Dashboard.css';
import Sidebar from '../pages/Sidebar'
import CommentSection from './CommentSection';
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../features/authSlice';
import Example from './analytics';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, isLoading } = useSelector((state) => state.auth);

  const [initialRenderCompleted, setInitialRenderCompleted] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getUser()).finally(() => {
        setInitialRenderCompleted(true);
      });
    } else {
      setInitialRenderCompleted(true);
    }
  }, []);

  useEffect(() => {
    if (initialRenderCompleted && !isLoading) {
      if (isSuccess && user) {
        navigate('/');
      } else if (isError || (!isSuccess && !user)) {
        navigate('/login');
      }
    }
  }, [user, isSuccess, isError, navigate, isLoading, initialRenderCompleted]);
  
  return (
    
    <div className="dashboard">
      <Sidebar/>
      <div className="box">Box 1 </div>
      <div className="box">Box 2</div>
      <div className="box"> <CommentSection /></div>
      <div className="box"> <Example /></div>
    </div>
  );
};

export default Home