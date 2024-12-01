import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { AgCharts } from 'ag-charts-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import '../Styles/AnalyticsPage.css';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const { instaPage, isLoadingInsta, insights, tiktokPage, youtubePage } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);

  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);

  const platformCardColors = { 
    Instagram: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
    TikTok: 'black',      
    YouTube: 'white',       
    X: 'white'          
  };

  const platformLineColors = {
    Instagram: '#FF69B4', 
    TikTok: 'black',      
    YouTube: 'red',       
    X: '#1DA1F2'          
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatforms((prevSelected) => {
      if (prevSelected.includes(platform)) {
        if (prevSelected.length > 1) {
          return prevSelected.filter((p) => p !== platform);
        }
        return prevSelected;
      } else {
        return [...prevSelected, platform];
      }
    });
  };

  const generateLikesData = () => {
    let res = [];
    const dateMap = new Map();
    if (!isLoadingInsta && instaPage) {
      const instaLikeCounts = instaPage.business_discovery.media.data.map((media) => media.like_count);
      const instaDates = instaPage.business_discovery.media.data.map((media) => media.timestamp);


      instaLikeCounts.forEach((likeCount, index) => {
        const date = new Date(instaDates[index]);
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).Instagram = likeCount;
      });
    }

    if (!isLoadingInsta && tiktokPage) {
      const tiktokLikes = tiktokPage.videos.data.videos.map((video) => video.like_count);
      const tiktokDates = tiktokPage.videos.data.videos.map((video) => new Date(video.create_time * 1000));
  
      tiktokLikes.forEach((likeCount, index) => {
        const date = tiktokDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).TikTok = likeCount;
      });
    }

    if (!isLoadingInsta && youtubePage) {
      const youtubeViews = youtubePage.videos.map((video) => video.statistics !== null ? Number(video.statistics.likes) : null)
      const youtubeDates = youtubePage.videos.map((video) => new Date(video.contentDetails.videoPublishedAt))

      youtubeViews.forEach((likeCount, index) => {
        const date = youtubeDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).YouTube = likeCount;
      });
    }
  
    res = Array.from(dateMap.values());
  
    return res;
  };

  const generateViewsData = () => {
    let res = [];
    const dateMap = new Map();
  
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'ig_reels_aggregated_all_plays_count');
      const dates = instaPage.business_discovery.media.data.map((media) => new Date(media.timestamp));
      const viewCounts = filteredArr.map((media) => media.values[0].value);
  
      viewCounts.forEach((viewCount, index) => {
        const date = dates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).Instagram = viewCount;
      });
    }
  
    if (!isLoadingInsta && tiktokPage) {
      const tiktokViews = tiktokPage.videos.data.videos.map((video) => video.view_count);
      const tiktokDates = tiktokPage.videos.data.videos.map((video) => new Date(video.create_time * 1000));
  
      tiktokViews.forEach((viewCount, index) => {
        const date = tiktokDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).TikTok = viewCount;
      });
    }

    if (!isLoadingInsta && youtubePage) {
      const youtubeViews = youtubePage.videos.map((video) => video.statistics !== null ? Number(video.statistics.views) : null)
      const youtubeDates = youtubePage.videos.map((video) => new Date(video.contentDetails.videoPublishedAt))

      youtubeViews.forEach((viewCount, index) => {
        const date = youtubeDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).YouTube = viewCount;
      });
    }
  
    res = Array.from(dateMap.values());
  
    return res;
  };

  const generateSharesData = () => {
    let res = [];
    const dateMap = new Map();
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'shares');
      const dates = instaPage.business_discovery.media.data.map((media) => new Date(media.timestamp));
      
      const shareCounts = filteredArr.map(media => media.values[0].value);
      shareCounts.forEach((shareCount, index) => {
        const date = dates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).Instagram = shareCount;
      });
    }

    if (!isLoadingInsta && tiktokPage) {
      const tiktokShares = tiktokPage.videos.data.videos.map((video) => video.share_count);
      const tiktokDates = tiktokPage.videos.data.videos.map((video) => new Date(video.create_time * 1000));
  
      tiktokShares.forEach((shareCount, index) => {
        const date = tiktokDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).TikTok = shareCount;
      });
    }

    if (!isLoadingInsta && youtubePage) {
      const youtubeViews = youtubePage.videos.map((video) => video.statistics !== null ? Number(video.statistics.shares) : null)
      const youtubeDates = youtubePage.videos.map((video) => new Date(video.contentDetails.videoPublishedAt))

      youtubeViews.forEach((shareCount, index) => {
        const date = youtubeDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).YouTube = shareCount;
      });
    }
    res = Array.from(dateMap.values())
    return res
  };

  const generateWatchTimeData = () => {
    let res = [];
    const dateMap = new Map();
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'ig_reels_avg_watch_time');
      const dates = instaPage.business_discovery.media.data.map((media) => new Date(media.timestamp));
      
      const watchTimeValues = filteredArr.map(media => media.values[0].value);
      watchTimeValues.forEach((watchCount, index) => {
        const date = dates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).Instagram = watchCount;
      });
    }

    if (!isLoadingInsta && youtubePage) {
      const youtubeViews = youtubePage.videos.map((video) => video.statistics !== null ? Number(video.statistics.averageViewDuration) : null)
      const youtubeDates = youtubePage.videos.map((video) => new Date(video.contentDetails.videoPublishedAt))

      youtubeViews.forEach((averageViewDuration, index) => {
        const date = youtubeDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).YouTube = averageViewDuration;
      });
    }

    res = Array.from(dateMap.values())
    return res
  };
  const generateReachData = () => {
    let res = [];
    const dateMap = new Map();
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'reach');
      const dates = instaPage.business_discovery.media.data.map((media) => new Date(media.timestamp));
      
      const reachValues = filteredArr.map(media => media.values[0].value);
      reachValues.forEach((reachCount, index) => {
        const date = dates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).Instagram = reachCount;
      });
    }
    res = Array.from(dateMap.values())
    return res
  };
  const generateSavedData = () => {
    let res = [];
    const dateMap = new Map();
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'saved');
      const dates = instaPage.business_discovery.media.data.map((media) => new Date(media.timestamp));
      
      const savesValues = filteredArr.map(media => media.values[0].value)
      savesValues.forEach((saveCount, index) => {
        const date = dates[index]
        if (!dateMap.has(date)) dateMap.set(date, { date })
        dateMap.get(date).Instagram = saveCount
      })
    }
    res = Array.from(dateMap.values())
    return res
  };

  const generateCommentsData = () => {
    let res = [];
    const dateMap = new Map();
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'comments');
      const dates = instaPage.business_discovery.media.data.map((media) => new Date(media.timestamp));
      
      const commentsValues = filteredArr.map(media => media.values[0].value);
      commentsValues.forEach((commentCount, index) => {
        const date = dates[index]
        if (!dateMap.has(date)) dateMap.set(date, { date })
        dateMap.get(date).Instagram = commentCount
      })
    }

    if (!isLoadingInsta && tiktokPage) {
      const tiktokComments = tiktokPage.videos.data.videos.map((video) => video.comment_count);
      const tiktokDates = tiktokPage.videos.data.videos.map((video) => new Date(video.create_time * 1000));
  
      tiktokComments.forEach((commentCount, index) => {
        const date = tiktokDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).TikTok = commentCount;
      });
    }

    if (!isLoadingInsta && youtubePage) {
      const youtubeViews = youtubePage.videos.map((video) => video.statistics !== null ? Number(video.statistics.comments) : null)
      const youtubeDates = youtubePage.videos.map((video) => new Date(video.contentDetails.videoPublishedAt))

      youtubeViews.forEach((commentCount, index) => {
        const date = youtubeDates[index];
        if (!dateMap.has(date)) dateMap.set(date, { date });
        dateMap.get(date).YouTube = commentCount;
      });
    }
    res = Array.from(dateMap.values())
    return res
  };

  const generateLikesSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} likes`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  const generateViewsSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} views`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  const generateSharesSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} shares`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  const generateWatchTimeSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} secs`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  const generateReachSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} Reach`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  const generateSavedSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} Saved`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  const generateCommentsSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformLineColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformLineColors[platform]
      },
      tooltip: {
        enabled: true,
        renderer: (params) => {
          const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            title: formattedDate,
            content: `${params.datum[platform]} Comments`,
            backgroundColor: platformLineColors[platform]
          };
        }
      }
    }));
  };

  if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
    return <NoAccount />;
  }
  if (isLoadingInsta || !instaPage) {
    return <Spinner />;
  }

  const viewsData = generateViewsData();
  const likesData = generateLikesData();
  const sharesData = generateSharesData();
  const watchTimeData = generateWatchTimeData();
  const reachData = generateReachData();
  const savedData = generateSavedData();
  const commentsData = generateCommentsData();

  const graphDataMap = {
    Likes: likesData,
    Views: viewsData,
    Shares: sharesData,
    AvgWatchTime: watchTimeData,
    Reach: reachData,
    Saved: savedData, 
    Comments: commentsData 
  };

  const likesSeries = generateLikesSeries(selectedPlatforms);
  const viewsSeries = generateViewsSeries(selectedPlatforms);
  const sharesSeries = generateSharesSeries(selectedPlatforms);
  const watchTimeSeries = generateWatchTimeSeries(selectedPlatforms);
  const reachSeries = generateReachSeries(selectedPlatforms);
  const savedSeries = generateSavedSeries(selectedPlatforms);
  const commentsSeries = generateCommentsSeries(selectedPlatforms);

  const graphSeriesMap = {
    Likes: likesSeries,
    Views: viewsSeries,
    Shares: sharesSeries,
    AvgWatchTime: watchTimeSeries,
    Reach: reachSeries,
    Saved: savedSeries,
    Comments: commentsSeries
  };

  const GraphComponent = ({ title, data, series }) => (
    <div className="analytics-charts">
      <AgCharts
        options={{
          data,
          axes: [
            { type: 'time', position: 'bottom' },
            {
              type: 'number',
              position: 'left',
              title: { text: title, color: 'black' }
            }
          ],
          series,
          legend: { position: "top" },
          title: {
            text: title,
            textAlign: 'left',
            fontSize: 18,
            fontFamily: 'Futura',
            color: 'black',
            style: 'bold'
          }
        }}
      />
    </div>
  );

const PlatformCard = ({ platform, isConnected, icon, pfp, isSelected, onClick }) => {
  const color = "white";
  const navigate = useNavigate();
  
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
      <div 
        className={`ap-platform-card disconnected`} 
        onClick={() => navigate('../Profile')} 
        style={{ color }}
      >
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


return (
  <div className="analytics-container">
    <header className="analytics-header">
      <h1>Analytics</h1>
      <div className="ap-social-media-platforms">
        <PlatformCard platform={"Instagram"} isConnected = {user.instagramConnected} icon={<FaInstagram size={25}/>} pfp={instaPage.business_discovery.profile_picture_url} isSelected={selectedPlatforms.includes("Instagram")} onClick={() => handlePlatformClick("Instagram")} />
        <PlatformCard platform={"TikTok"} isConnected = {user.tiktokConnected} icon={<FaTiktok size={23}/>} pfp={tiktokPage.profilePicture} isSelected={selectedPlatforms.includes("TikTok")} onClick={() => handlePlatformClick("TikTok")} />
        <PlatformCard platform={"YouTube"} isConnected = {user.youtubeConnected} icon={<FaYoutube size={25} color={"red"}/>} pfp={youtubePage.profilePicture} isSelected={selectedPlatforms.includes("YouTube")} onClick={() => handlePlatformClick("YouTube")} />
        <PlatformCard platform={"X"} isConnected = {false} icon={<FaSquareXTwitter size={24} color={"black"}/>} isSelected={selectedPlatforms.includes("X")} onClick={() => handlePlatformClick("X")} />
      </div>
    </header>
    <div className="nonHeader">
      {['Likes', 'Views', 'Shares', 'AvgWatchTime','Reach','Saved','Comments'].map((graphType) => (
        <GraphComponent
          key={graphType}
          title={graphType}
          data={graphDataMap[graphType]} 
          series={graphSeriesMap[graphType]}
        />
      ))}
    </div>
  </div>
);
};

export default AnalyticsPage;
