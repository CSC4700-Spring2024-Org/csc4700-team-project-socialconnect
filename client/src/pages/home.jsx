import '../Styles/Dashboard.css';
import CommentSection from './CommentSection';
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUser, removePostStatusMessage } from '../features/authSlice';
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
        } else if (!isErrorInsta && user.postStatusMessage && user.postStatusMessage !== '') {
          const dateMatch = user.postStatusMessage.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
          const datePart = dateMatch ? dateMatch[0] : null;
          if (datePart !== null) {
            const date = new Date(datePart)
            const options = {
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
            const updatedMessage = user.postStatusMessage.replace(datePart, formattedDate)
            toast(updatedMessage)
            dispatch(removePostStatusMessage())
          } else {
            toast(user.postStatusMessage)
            dispatch(removePostStatusMessage())
          }
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