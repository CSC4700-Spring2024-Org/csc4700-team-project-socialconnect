import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux';

function renderEventContent(eventInfo) {
    return (
      <>
        <i>{eventInfo.event.title}</i>
      </>
    )
} 

export default function Calendar() {
  const { instaPage, isLoadingInsta, isSuccessInsta } = useSelector((state) => state.insta)

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
    <FullCalendar
       plugins={[dayGridPlugin]}
       initialView='dayGridMonth'
       weekends={true}
       events={events}
       eventContent={renderEventContent}
    /> 
  );
}