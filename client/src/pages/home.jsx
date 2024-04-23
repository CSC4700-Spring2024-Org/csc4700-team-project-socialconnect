import '../Styles/Dashboard.css';
import Sidebar from '../pages/Sidebar'
import CommentSection from './CommentSection';
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../features/authSlice';
import Analytics from './analytics';
import { getInstaProfile } from '../features/instaSlice';
import Calendar from './calendar';
import Chart from './chart';


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
        if (user.instaRefresh) {
          dispatch(getInstaProfile(user))
        }
      } else if (isError || (!isSuccess && !user)) {
        navigate('/login');
      }
    }
  }, [user, isSuccess, isError, navigate, isLoading, initialRenderCompleted]);
 
  return (
    <div className="dashboard">
      <Sidebar/>
      <div className="box1"> <Calendar/> </div>
      <div className="box2"> <Chart/> </div>
      <div className="box3"> <CommentSection/> </div>
      <div className="box4"> <Analytics/> </div>
    </div>
  );
};

export default Home