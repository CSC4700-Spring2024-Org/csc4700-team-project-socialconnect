import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import '../Styles/Calendar.css';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

function renderEventContent(eventInfo) {
  return (
    <>
      {eventInfo.event.extendedProps.source === 'Instagram' && (
        <FaInstagram style={{ fontSize: '16px', color: '#FF69B4' }} />
      )}
      {eventInfo.event.extendedProps.source === 'TikTok' && (
        <FaTiktok style={{ fontSize: '16px', color: 'black' }} />
      )}
      {eventInfo.event.extendedProps.source === 'YouTube' && (
        <FaYoutube style={{ fontSize: '16px', color: 'red' }} />
      )}
    </>
  );
}

export default function Calendar() {
  const { instaPage, isLoadingInsta, tiktokPage, youtubePage } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);

  if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
    return <NoAccount />;
  }

  if (isLoadingInsta || !instaPage) {
    return <Spinner />;
  }

  const instaEvents = instaPage.business_discovery.media.data.map((media, i) => ({
    title: 'Instagram Post',
    start: media.timestamp,
    source: 'Instagram',
  }));

  const tiktokEvents = tiktokPage?.videos.data.videos.map((post, i) => ({
    title: 'TikTok Post',
    start: new Date(post.create_time * 1000).toISOString(),
    source: 'TikTok',
  }));

  const youtubeEvents = youtubePage?.videos.map((post, i) => ({
    title: 'Youtube Post',
    start: post.contentDetails.videoPublishedAt,
    source: 'YouTube', 
  }));
  

  const events = [...(instaEvents || []), ...(tiktokEvents || []), ...(youtubeEvents || [])]

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
