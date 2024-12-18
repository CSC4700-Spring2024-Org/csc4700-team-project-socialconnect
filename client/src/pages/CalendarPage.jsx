import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const CalendarPage = ({ posts }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { instaPage, isLoadingInsta, tiktokPage, insights, youtubePage } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowTimePicker(true);
    
    // Remove highlight from previously selected date
    const prevSelected = document.querySelector('.fc-day-selected');
    if (prevSelected) prevSelected.classList.remove('fc-day-selected');
    
    // Add highlight to newly selected date
    info.dayEl.classList.add('fc-day-selected');
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime.format('HH:mm:ss'));
  }

  const handleScheduleClick = () => {
    if (selectedDate && selectedTime) {
      navigate(`/post?datetime=${encodeURIComponent(`${selectedDate}T${selectedTime}`)}`);
    }
  };

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    setSelectedTime(`${hours}:${minutes}:${seconds}`);
  }, []); 

  const combinedPosts = useMemo(() => {
    return [
    ...(tiktokPage ? tiktokPage.videos.data.videos.map(post => ({
      timestamp: post.create_time * 1000,
      source: 'TikTok',
      caption: post.video_description,
      media_url: `https://www.tiktok.com/player/v1/${post.id}?description=1`,
      media_type: 'VIDEO',
      views: post.view_count,
      likes: post.like_count,
      shares: post.share_count
    })) : []),
    ...(youtubePage ? youtubePage.videos.map(post => ({
      timestamp: post.contentDetails.videoPublishedAt,
      source: 'YouTube',
      caption: post.snippet.title,
      media_url: `https://youtube.com/embed/${post.contentDetails.videoId}?showinfo=0&loop=1&controls=0&modestbranding=1`,
      media_type: 'VIDEO',
      views: (post.statistics ? post.statistics.views : 0),
      likes: (post.statistics ? post.statistics.likes : 0),
      shares: (post.statistics ? post.statistics.shares : 0)
    })) : []),
    ...(instaPage ? instaPage.business_discovery.media.data.map(post => ({
      timestamp: post.timestamp,
      media_url: post.media_url,
      media_type: post.media_type,
      caption: post.caption,
      likes: post.like_count,
      views: insights.find((insight) => insight.name === "ig_reels_aggregated_all_plays_count" && insight.id.includes(post.id))?.values[0].value,
      shares: insights.find((insight) => insight.name === "shares" && insight.id.includes(post.id))?.values[0].value,
      source: 'Instagram'
    })) : [])
  ]}, [tiktokPage, youtubePage, instaPage])

  function renderEventContent(eventInfo) {
    return (
      <>
        {eventInfo.event.extendedProps.source === 'Instagram' && (
          <FaInstagram className="calendar-icon instagram-icon" />
        )}
        {eventInfo.event.extendedProps.source === 'TikTok' && (
          <FaTiktok className="calendar-icon tiktok-icon" />
        )}
        {eventInfo.event.extendedProps.source === 'YouTube' && (
        <FaYoutube className="calendar-icon youtube-icon" />
      )}
      </>
    );
  }

  const platformCardColors = { 
    Instagram: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
    TikTok: 'black',      
    YouTube: 'white',       
    X: 'white'          
  };

  const platformBorderColors = {
    Instagram: '#FF69B4', 
    TikTok: 'black',      
    YouTube: 'red',       
    X: '#1DA1F2'          
  };

  const platformBoxShadows = {
    Instagram: '0 0 10px rgba(225, 48, 108, 1)'        
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

  const PlatformCard = ({ platform, isConnected, icon, pfp, isSelected, onClick }) => {
    const color = "white";
    
    if (isConnected == true) {
      return (
        <div className={`ap-platform-card ${isSelected ? 'selected' : ''}`} onClick={onClick} style = {{color}}>
          <div className="profile-container">
            <div className="pc-platform-icon" style={{ background: platformCardColors[platform] }}>
              {icon}
            </div>
            <img src={pfp} style={{ width: '100%', height: '100%', objectFit: "cover" }} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={`ap-platform-card disconnected`} onClick={() => navigate('../Profile')} style={{ color }}>
          <div className="profile-container">
            <div className="pc-platform-icon" style={{ background: "#e0e0e0" }}>
              {icon}
            </div>
            <button className='ap-connect-platform-button'>
              Connect Platform
            </button>
          </div>
        </div>
      );
    }
  };

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

  const PostSummary = ({ source, post, caption, likes, shares, views }) => {
    const [isVisible, setIsVisible] = useState(false);
    const feedRef = useRef(null);
    const iframeRef = useRef(null)

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

  useEffect(() => {
    if (iframeRef.current && post) {
      iframeRef.current.src = post; 
    }
  }, [post])

  return (
    <div 
      className="cp-post-container" 
      style={{ boxShadow: platformBoxShadows[source] }}
    >
     <div className="cp-post-media" ref={feedRef}>
      {(source === 'TikTok' || source === 'YouTube') ? (
        isVisible && post ? (
          <iframe className="cp-post-media" height="100%" width="100%" src={post} allow="fullscreen" ref={iframeRef}></iframe>
        ) : (
          <p className="cp-post-media">Video Not Available</p>
        )
      ) : (
        <video
          src={post}
          type="video/mp4"
          controls
          playsInline
          loop
          className='cp-post-media'
        ></video>
      )}
    </div>
      <div className="cp-post-caption">
        <p>{caption}</p>
      </div>
      <div className="cp-post-stats-container">
        <div className="cp-post-mini-container">
          <div style={{ color: platformBorderColors[source] }}>{platformSymbols[source]}</div>
        </div>
        <div className="cp-post-mini-container">
          <div><FaPlay /> {views ? views : 0}</div>
        </div>
        <div className="cp-post-mini-container">
          <div><FaHeart style={{ color: "red" }} /> {likes ? likes : 0}</div>
        </div>
        <div className="cp-post-mini-container">
          <div><FaPaperPlane style={{ color: '#1877F2' }} /> {shares ? shares : 0}</div>
        </div>
      </div>
    </div>
  );
};

return (
  <div className="calendar-page-container">
    <div className='cp-header-and-feed-container'>
      <h1 style={{ height: "15px", marginLeft: "10px", fontFamily: "-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif" }}>Posts Summary</h1>
      <div className="cp-platforms-container">
        <PlatformCard
          platform={"Instagram"}
          isConnected={user.instagramConnected}
          icon={<FaInstagram size={20} />}
          pfp={instaPage.business_discovery.profile_picture_url}
          isSelected={selectedPlatforms.includes("Instagram")}
          onClick={() => handlePlatformClick("Instagram")}
        />
        <PlatformCard
          platform={"TikTok"}
          isConnected={user.tiktokConnected}
          icon={<FaTiktok size={20} />}
          pfp={tiktokPage?.profilePicture}
          isSelected={selectedPlatforms.includes("TikTok")}
          onClick={() => handlePlatformClick("TikTok")}
        />
        <PlatformCard
          platform={"YouTube"}
          isConnected={user.youtubeConnected}
          icon={<FaYoutube size={22} color={"red"} />}
          pfp={youtubePage?.profilePicture}
          isSelected={selectedPlatforms.includes("YouTube")}
          onClick={() => handlePlatformClick("YouTube")}
        />
        <PlatformCard
          platform={"X"}
          isConnected={false}
          icon={<FaSquareXTwitter size={20} color={"black"} />}
          isSelected={selectedPlatforms.includes("X")}
          onClick={() => handlePlatformClick("X")}
        />
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
    <div className="cp-right-side-container">
      <div className="cp-calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          eventContent={renderEventContent}
          dateClick={handleDateClick} 
        />
        </div>
        <div className = "cp-time-picker-container"> 
        {showTimePicker && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem>
                <DesktopTimePicker value={dayjs(selectedTime, 'HH:mm')} onChange={handleTimeChange}/>
              </DemoItem>
          </LocalizationProvider>
        )}
        </div>
        <button className="cp-button" onClick={handleScheduleClick}>
          Schedule Post
        </button>
    </div>
  </div>
);

}
export default CalendarPage;
