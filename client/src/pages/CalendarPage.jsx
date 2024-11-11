import React, { useState, useEffect, useRef } from 'react';
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
import TimePicker from 'react-time-picker'; // Install this component if not already installed
import interactionPlugin from '@fullcalendar/interaction';


const CalendarPage = ({ posts }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00"); // Default time
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowTimePicker(true);
    
    // Remove highlight from previously selected date
    const prevSelected = document.querySelector('.fc-day-selected');
    if (prevSelected) prevSelected.classList.remove('fc-day-selected');
    
    // Add highlight to newly selected date
    info.dayEl.classList.add('fc-day-selected');
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleScheduleClick = () => {
    if (selectedDate && selectedTime) {
      const urlEncodedDateTime = `${selectedDate}T${selectedTime}`;
      navigate(`/post?datetime=${encodeURIComponent(urlEncodedDateTime)}`);
    }
  };

  const handleClick = () => {
    navigate('/post');
  };

 

  function renderEventContent(eventInfo) {
    return (
      <>
        {eventInfo.event.extendedProps.source === 'Instagram' && (
          <FaInstagram style={{ fontSize: '11px', color: '#FF69B4' }} />
        )}
        {eventInfo.event.extendedProps.source === 'TikTok' && (
          <FaTiktok style={{ fontSize: '12px', color: 'black' }} />
        )}
      </>
    );
  }

  const platformColors = {
    Instagram: '#FF69B4', 
    TikTok: 'black',      
    YouTube: 'red',       
    X: '#black'          
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
        className={`cp-platform-card ${isSelected ? 'selected' : ''}`} 
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

  const instaEvents = instaPage.business_discovery.media.data.map((media, i) => ({
    title: 'Instagram Post',
    start: media.timestamp,
    source: 'Instagram',
  }));

  const tiktokEvents = tiktokPage.map((post, i) => ({
    title: 'TikTok Post',
    start: new Date(post.create_time * 1000).toISOString(),
    source: 'TikTok',
  }));

  const events = [...instaEvents, ...tiktokEvents];

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

  const PostSummary = ({ source, post, caption, likes, shares, views }) => {
    const [isVisible, setIsVisible] = useState(false);
    const feedRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              if (entry.isIntersecting) {
                  setIsVisible(true)
              }
          },
          {
              root: null,
              rootMargin: '0px',
              threshold: 0.1
          }
      );
  
      if (feedRef.current) {
          observer.observe(feedRef.current);
      }
  
      return () => {
          if (feedRef.current) {
              observer.unobserve(feedRef.current);
          }
      };
  }, []);

  return (
    <div 
      className="cp-post-container" 
      style={{ borderColor: platformColors[source] }}
    >
     <div className="cp-post-media-container" ref={feedRef}>
      {(source === 'Instagram' || source === 'TikTok') ? (
        isVisible && post ? (
          <iframe className="cp-post-media" height="100%" width="100%" src={post} allow="fullscreen"></iframe>
        ) : (
          <p className="cp-post-media">Video Not Available</p>
        )
      ) : (
        <img src={post} alt={caption} className="cp-post-media" />
      )}
    </div>
      <div className="cp-post-caption">
        <p>{caption}</p>
      </div>
      <div className="cp-post-stats-container">
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
    </div>
  );
};

  return (
    <div className="calendar-page-container">
      <div className='cp-header-and-feed-container'>
        <h1 style={{height: "10px"}}> Posts Summary</h1>
        <h1 className="cp-header">Select Platforms:</h1>
        <div className="cp-platforms-container">
          <PlatformCard platform={"Instagram"} icon={<FaInstagram size={20} />} isSelected={selectedPlatforms.includes("Instagram")} onClick={() => handlePlatformClick("Instagram")} />
          <PlatformCard platform={"TikTok"} icon={<FaTiktok size={20} />} isSelected={selectedPlatforms.includes("TikTok")} onClick={() => handlePlatformClick("TikTok")} />
          <PlatformCard platform={"YouTube"} icon={<FaYoutube size={20} />} isSelected={selectedPlatforms.includes("YouTube")} onClick={() => handlePlatformClick("YouTube")} />
          <PlatformCard platform={"X"} icon={<FaSquareXTwitter size={20} />} isSelected={selectedPlatforms.includes("X")} onClick={() => handlePlatformClick("X")} />
        </div>
        <div className="cp-feed-container">
          {combinedPosts.map((post) => 
            selectedPlatforms.includes(post.source) && (
              <PostSummary 
                key={post.timestamp} 
                source={post.source} 
                post={post.media_url} 
                caption={post.caption} 
                likes={post.likes} 
                shares={post.shares} 
                views={post.views} 
              />
            )
          )}
        </div>
      </div>
      <div className="cp-calendar-and-platforms-container">
        <div className="cp-calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin,interactionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            eventContent={renderEventContent}
            dateClick={handleDateClick} // Handle date clicks
          />
        {showTimePicker && (
          <div className="time-picker-container">
            <TimePicker
              onChange={handleTimeChange}
              value={selectedTime}
              clearIcon={null}
            />
            <button onClick={handleScheduleClick} className="schedule-post-button">
              Schedule Post
            </button>
          </div>
        )}
        </div>
        {selectedDate && (
        <div className="time-picker-container">
          <p>Selected Date: {selectedDate}</p>
          <TimePicker
            onChange={setSelectedTime} // Update selected time
            value={selectedTime}
          />
        </div>
      )}
        <button className="cp-button" onClick={handleScheduleClick}>
          Schedule Post
        </button>
       
      </div>
    </div>
  );
};

export default CalendarPage;
