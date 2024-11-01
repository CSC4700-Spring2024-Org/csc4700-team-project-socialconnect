import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { AgCharts } from 'ag-charts-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import '../Styles/AnalyticsPage.css';

const AnalyticsPage = () => {
  const { instaPage, isLoadingInsta, insights, tiktokPage } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);

  const [selectedPlatforms, setSelectedPlatforms] = useState(["Instagram"]);

  const platformColors = {
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
    if (!isLoadingInsta && instaPage) {
      const last25InstaLikeCounts = instaPage.business_discovery.media.data.map((media) => media.like_count);
      const last25InstaDates = instaPage.business_discovery.media.data.map((media) => media.timestamp);

      const instaLikeCounts = last25InstaLikeCounts.slice(0, 10);
      const instaDates = last25InstaDates.slice(0, 10);

      return instaLikeCounts.map((likeCount, index) => ({
        Instagram: likeCount,
        TikTok: likeCount * 2,
        YouTube: likeCount * 0.75,
        X: likeCount * 0.5,
        date: new Date(instaDates[index])
      }));
    }
    return [];
  };

  const generateViewsData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'ig_reels_aggregated_all_plays_count');
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      
      const viewCounts = filteredArr.map(media => media.values[0].value);
      return viewCounts.map((viewCount, index) => ({
        Instagram: viewCount,
        TikTok: viewCount * 2,
        YouTube: viewCount * 0.75,
        X: viewCount * 0.5,
        date: new Date(dates[index])
      }));
    }
    return [];
  };

  const generateSharesData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'shares');
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      
      const shareCounts = filteredArr.map(media => media.values[0].value);
      return shareCounts.map((shareCount, index) => ({
        Instagram: shareCount,
        TikTok: shareCount * 2,
        YouTube: shareCount * 0.75,
        X: shareCount * 0.5,
        date: new Date(dates[index])
      }));
    }
    return [];
  };

  const generateWatchTimeData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'ig_reels_avg_watch_time');
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      
      const watchTimeValues = filteredArr.map(media => media.values[0].value);
      return watchTimeValues.map((watchTime, index) => ({
        Instagram: watchTime/1000,
        TikTok: watchTime/1000 * 1.2,
        YouTube: watchTime/1000 * 1.5,
        X: watchTime/1000 * 0.8,
        date: new Date(dates[index])
      }));
    }
    return [];
  };
  const generateReachData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'reach');
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      
      const watchTimeValues = filteredArr.map(media => media.values[0].value);
      return watchTimeValues.map((watchTime, index) => ({
        Instagram: watchTime,
        TikTok: watchTime * 1.2,
        YouTube: watchTime * 1.5,
        X: watchTime * 0.8,
        date: new Date(dates[index])
      }));
    }
    return [];
  };
  const generateSavedData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'saved');
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      
      const watchTimeValues = filteredArr.map(media => media.values[0].value);
      return watchTimeValues.map((watchTime, index) => ({
        Instagram: watchTime,
        TikTok: watchTime * 1.2,
        YouTube: watchTime * 1.5,
        X: watchTime * 0.8,
        date: new Date(dates[index])
      }));
    }
    return [];
  };

  const generateCommentsData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'comments');
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      
      const watchTimeValues = filteredArr.map(media => media.values[0].value);
      return watchTimeValues.map((watchTime, index) => ({
        Instagram: watchTime,
        TikTok: watchTime * 1.2,
        YouTube: watchTime * 1.5,
        X: watchTime * 0.8,
        date: new Date(dates[index])
      }));
    }
    return [];
  };

  const generateLikesSeries = (platforms) => {
    return platforms.map((platform) => ({
      type: 'line',
      xKey: 'date',
      yKey: platform,
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
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
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
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
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
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
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
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
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
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
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
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
      stroke: platformColors[platform],
      marker: {
        enabled: true,
        size: 5,
        fill: platformColors[platform]
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
            backgroundColor: platformColors[platform]
          };
        }
      }
    }));
  };


  console.log(tiktokPage)
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

  const PlatformCard = ({ platform, icon, isSelected, onClick }) => {
    const color = platformColors[platform];
    
    return (
      <div 
        className={`platform-card ${isSelected ? 'selected' : ''}`} 
        onClick={onClick}
        style = {{color}}
      >
        {icon}
      </div>
    );
  };

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Analytics</h1>
        <div className="social-media-platforms">
          <PlatformCard platform={"Instagram"} icon={<FaInstagram size={20}/>} isSelected={selectedPlatforms.includes("Instagram")} onClick={() => handlePlatformClick("Instagram")} />
          <PlatformCard platform={"TikTok"} icon={<FaTiktok size={20}/>} isSelected={selectedPlatforms.includes("TikTok")} onClick={() => handlePlatformClick("TikTok")} />
          <PlatformCard platform={"YouTube"} icon={<FaYoutube size={20}/>} isSelected={selectedPlatforms.includes("YouTube")} onClick={() => handlePlatformClick("YouTube")} />
          <PlatformCard icon={<FaSquareXTwitter size={20}/>} isSelected={selectedPlatforms.includes("X")} onClick={() => handlePlatformClick("X")} />
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
