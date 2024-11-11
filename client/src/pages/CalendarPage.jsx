import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../Styles/CalendarPage.css';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import NoAccount from '../components/NoAccount';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaHeart, FaPlay, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CalendarPage = ({ posts }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/post'); 
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  const platformColors = {
    Instagram: '#FF69B4', 
    TikTok: 'black',      
    YouTube: 'red',       
    X: '#1DA1F2'          
  };

  const platformSymbols = {
    Instagram: <FaInstagram size={30} />,
    TikTok: <FaTiktok size={30} />,
    YouTube: <FaYoutube />,
    X: <FaSquareXTwitter />
  };

  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);

  const handlePlatformClick = (platform) => {
    setSelectedPlatforms((prevSelected) => {
      if (prevSelected.includes(platform)) {
        return prevSelected.length > 1 ? prevSelected.filter((p) => p !== platform) : prevSelected;
      } else {
        return [...prevSelected, platform];
      }
    });
  };

  const PlatformCard = ({ platform, icon, isSelected, onClick }) => {
    const color = platformColors[platform];
    return (
      <div 
        className={`platform-card ${isSelected ? 'selected' : ''}`} 
        onClick={onClick}
        style={{ color }}
      >
        {icon}
      </div>
    );
  };

  const { instaPage, isLoadingInsta, tiktokPage, insights } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);

  if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
    return <NoAccount />;
  }

  if (isLoadingInsta || !instaPage) {
    return <Spinner />;
  }

  const datesPosted = instaPage.business_discovery.media.data.map(media => media.timestamp);
  const events = datesPosted.map((date, i) => ({
    title: 'Posted',
    start: datesPosted[datesPosted.length - i - 1]
  }));

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

  const PostSummary = ({ source, post, likes, shares, views }) => (
    <div className="cp-post-container" style={{ borderColor: platformColors[source] }}>
      <div className="cp-post-mini-container">
        <div style={{ color: platformColors[source] }}>{platformSymbols[source]}</div>
      </div>
      <div className="cp-post-mini-container">
        {views ? <div><FaPlay /> {views}</div> : null}
      </div>
      <div className="cp-post-mini-container">
        <div><FaHeart style={{ color: "red" }} /> {likes}</div>
      </div>
      <div className="cp-post-mini-container">
        {shares ? <div><FaPaperPlane style={{ color: '#1877F2' }} /> {shares}</div> : null}
      </div>
    </div>
  );

  return (
    <div className="calendar-page-container">
      <div className='cp-header-and-feed-container'>
        <h1>Posts Summary</h1>
        <div className="cp-feed-container">
          {combinedPosts.map((post) => 
            selectedPlatforms.includes(post.source) && (
              <PostSummary key={post.timestamp} source={post.source} post={post.media_url} likes={post.likes} shares={post.shares} views={post.views} />
            )
          )}
        </div>
      </div>
      <div className="cp-calendar-and-platforms-container">
        <div className="cp-calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            eventContent={renderEventContent}
          />
        </div>
        <button className="cp-button" onClick={handleClick}>
          Schedule Post
        </button>
        <h1 className="cp-header">Select Platforms:</h1>
        <div className="cp-platforms-container">
          <PlatformCard platform={"Instagram"} icon={<FaInstagram size={20} />} isSelected={selectedPlatforms.includes("Instagram")} onClick={() => handlePlatformClick("Instagram")} />
          <PlatformCard platform={"TikTok"} icon={<FaTiktok size={20} />} isSelected={selectedPlatforms.includes("TikTok")} onClick={() => handlePlatformClick("TikTok")} />
          <PlatformCard platform={"YouTube"} icon={<FaYoutube size={20} />} isSelected={selectedPlatforms.includes("YouTube")} onClick={() => handlePlatformClick("YouTube")} />
          <PlatformCard platform={"X"} icon={<FaSquareXTwitter size={20} />} isSelected={selectedPlatforms.includes("X")} onClick={() => handlePlatformClick("X")} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
