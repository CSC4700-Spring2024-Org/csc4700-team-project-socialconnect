import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../Styles/CalendarPage.css';
import { useSelector } from 'react-redux';
import '../Styles/Calendar.css'
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
    <div className="calendar-page">
      <div className="feed">
        <h1>Calendar</h1>
        <p>View your posts on a calendar View your posts on a calendar View your posts on a calendar View your posts on a calendar</p>
      </div>
      <div className="calendar-container"> 
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        height="100%"  
      /> 
    </div>
    </div>
  );
};

export default CalendarPage;
