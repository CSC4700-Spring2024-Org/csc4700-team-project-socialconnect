import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../Styles/CalendarPage.css';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import NoAccount from '../components/NoAccount';

function renderEventContent(eventInfo) {
  return (
    <>
      <i>{eventInfo.event.title}</i>
    </>
  )
} 


const CalendarPage = ({ posts }) => {
  // Convert posts to calendar events
  const { instaPage, isLoadingInsta, tiktokPage } = useSelector((state) => state.insta)

  const { user, isLoading } = useSelector((state) => state.auth);

if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
  return <NoAccount />
}

if (isLoadingInsta || !instaPage) {
  return <Spinner />
}

const datesPosted = instaPage.business_discovery.media.data.map(media => media.timestamp);
const events = [];
for (let i = 0; i < datesPosted.length; i++) {
    events[i] = {
      title: 'Posted', start: datesPosted[datesPosted.length - i - 1]
    }
}


  return (
    <div className="calendar-page-container">
      <div className='cp-header-and-feed-container'>
        <h1>Posts Summary</h1>
        <div className="cp-feed-container">
          <div className='cp-post-container'>Post 1</div>
          <div className='cp-post-container'>Post 2</div>
          <div className='cp-post-container'>Post 3</div>
          <div className='cp-post-container'>Post 4</div>
          <div className='cp-post-container'>Post 5</div>
          <div className='cp-post-container'>Post 6</div>
          <div className='cp-post-container'>Post 7</div>
          <div className='cp-post-container'>Post 8</div>
          <div className='cp-post-container'>Post 9</div>
          <div className='cp-post-container'>Post 10</div>
          <div className='cp-post-container'>Post 11</div>
          <div className='cp-post-container'>Post 12</div>
        </div>
      </div>
      <div className="cp-calendar-container"> 
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventContent={renderEventContent} 
        /> 
      </div>
    </div>
  );
};

export default CalendarPage;
