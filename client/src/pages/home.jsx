import '../Styles/Dashboard.css';
import Sidebar from '../pages/Sidebar'
import CommentSection from './CommentSection';
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../features/authSlice';
import Example from './analytics';
import { BarChart } from '@tremor/react';
import Example1 from './chart';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';


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
  
  const events = [
    { title: 'Meeting', start: new Date() }
  ] 

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  } 

  return (
    
    <div className="dashboard">
      <Sidebar/>
      <div className="box1"><FullCalendar
       plugins={[dayGridPlugin]}
       initialView='dayGridMonth'
       weekends={true}
       events={events}
       eventContent={renderEventContent}
      /> </div>
      <div className="box"> <Example1/> </div>
      <div className="box"> <CommentSection /></div>
      <div className="box4"> <Example /></div>
    </div>
  );
};

export default Home