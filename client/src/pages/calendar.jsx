import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import '../Styles/Calendar.css'
function renderEventContent(eventInfo) {
    return (
      <>
        <i>{eventInfo.event.title}</i>
      </>
    )
} 

export default function Calendar() {
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
  );
}