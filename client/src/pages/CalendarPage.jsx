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

const platformColors = {
  Instagram: '#FF69B4', 
  TikTok: 'black',      
  YouTube: 'red',       
  X: '#1DA1F2'          
};

const CalendarPage = ({ posts }) => {
  // Convert posts to calendar events
  const { instaPage, isLoadingInsta, tiktokPage, insights } = useSelector((state) => state.insta)

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

const combinedPosts = [
  ...tiktokPage.map(post => ({
    timestamp: post.create_time * 1000,
    source: 'TikTok',
    caption: post.video_description,
    media_url: `https://www.tiktok.com/player/v1/${post.id}?description=1`,
    media_type: 'VIDEO',
    views: post.view_count,
    likes: post.like_count,
    shares: post.share_count
  })),
  ...instaPage.business_discovery.media.data.map(post => ({
    timestamp: post.timestamp,
    media_url: post.media_url,
    media_type: post.media_type,
    caption: post.caption,
    likes: post.like_count,
    views: insights.find((insight) => insight.name === "ig_reels_aggregated_all_plays_count" && insight.id.includes(post.id))?.values[0].value,
    shares: insights.find((insight) => insight.name === "shares" && insight.id.includes(post.id))?.values[0].value,
    source: 'Instagram'
  }))
];
// console.log(combinedPosts);
const PostSummary = ({ source, post, likes, shares, views }) => (
  <div className="cp-post-container" style={{ borderColor: platformColors[source] }}>
    <div>likes: {likes}</div>
    {shares ? <div>shares:{shares}</div>:<></>}
    {views ? <div>views:{views}</div>:<></>}
  </div>
);

  return (
    <div className="calendar-page-container">
      <div className='cp-header-and-feed-container'>
        <h1>Posts Summary</h1>
        <div className="cp-feed-container">
          {/* <PostSummary platform="Instagram"/>
          <PostSummary platform="TikTok"/> */}
          {combinedPosts.map((post) => {
            return <PostSummary source={post.source} post={post.media_url} likes = {post.likes} shares={post.shares} views={post.views}/>
          })}
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
