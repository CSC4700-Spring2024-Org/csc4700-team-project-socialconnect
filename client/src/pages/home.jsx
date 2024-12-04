import '../Styles/Dashboard.css';
import CommentSection from './CommentSection';
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../features/authSlice';
import Analytics from './analytics';
import { getInstaProfile } from '../features/instaSlice';
import Calendar from './calendar';
import Chart from './chart';
import { toast } from 'react-toastify';


const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, isLoading } = useSelector((state) => state.auth);
  const { message, isErrorInsta, instaPage, tiktokPage } = useSelector((state) => state.insta)

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
        // navigate('/');
        if (isErrorInsta) {
          toast.error(message)
        } else if (!isErrorInsta && message) {
          toast(message)
        }
        if ((user.instagramConnected && !instaPage) || (user.tiktokConnected && !tiktokPage)) {
          dispatch(getInstaProfile(user))
        }
      } else if (isError || (!isSuccess && !user)) {
        navigate('/login');
      }
    }
  }, [user, isSuccess, isError, navigate, isLoading, initialRenderCompleted, isErrorInsta]);
 
  return (
    <div className="dashboard">
      <div className='dashboard-content'>
        <div className="box1"> <Calendar/> </div>
        <div className="box2"> <Chart/> </div>
        <div className="box3"> <CommentSection/> </div>
        <div className="box4"> <Analytics/> </div>
      </div>
    </div>
  );
};

export default Home