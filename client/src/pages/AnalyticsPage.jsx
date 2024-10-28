import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { AgCharts } from 'ag-charts-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import '../Styles/AnalyticsPage.css';

const AnalyticsPage = () => {
  const { instaPage, isLoadingInsta, insights } = useSelector((state) => state.insta);
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
        // Check if more than one platform is selected before allowing deselect
        if (prevSelected.length > 1) {
          return prevSelected.filter((p) => p !== platform);
        }
        return prevSelected; // Prevent deselecting the last platform
      } else {
        return [...prevSelected, platform];
      }
    });
  };

  const generateLikesData = () => {
    if (!isLoadingInsta && instaPage) {
      const likeCounts = instaPage.business_discovery.media.data.map((media) => media.like_count);
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);

      return likeCounts.map((likeCount, index) => ({
        Instagram: likeCount,
        TikTok: likeCount * 2,
        YouTube: likeCount * 0.75,
        X: likeCount * 0.5,
        date: new Date(dates[index])
      }));
    }
    return [];
  };

  const generateViewsData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'ig_reels_aggregated_all_plays_count')
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      console.log(filteredArr)
      const likeCounts = filteredArr.map(
        media => media.values[0].value
      );
      return likeCounts.map((likeCount, index) => ({
        Instagram: likeCount,
        TikTok: likeCount * 2,
        YouTube: likeCount * 0.75,
        X: likeCount * 0.5,
        date: new Date(dates[index])
      }));
    }
    return [];
  };

  const generateSharesData = () => {
    if (!isLoadingInsta && insights) {
      const filteredArr = insights.filter((metric) => metric.name === 'shares')
      const dates = instaPage.business_discovery.media.data.map((media) => media.timestamp);
      console.log(filteredArr)
      const likeCounts = filteredArr.map(
        media => media.values[0].value
      );
      return likeCounts.map((likeCount, index) => ({
        Instagram: likeCount,
        TikTok: likeCount * 2,
        YouTube: likeCount * 0.75,
        X: likeCount * 0.5,
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
            content: `${params.datum[platform]} likes`,
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
            content: `${params.datum[platform]} likes`,
            backgroundColor: platformColors[platform]
          };
        }
      }
    }));
  };

  if (!isLoading && (user && !user.instaRefresh)) {
    return <NoAccount />;
  }
  if (isLoadingInsta || !instaPage) {
    return <Spinner />;
  }

  const viewsData = generateViewsData();
  const likesData = generateLikesData();
  const sharesData = generateSharesData();

  const graphDataMap = {
    Likes: likesData,
    Views: viewsData,
    Shares: sharesData,
  };

  const graphSeriesMap = {
    Likes: generateLikesData,
    Views: generateViewsData,
    Shares: generateSharesData
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
  
  const PlatformCard = ({ icon, isSelected, onClick }) => {
    return (
      <div 
        className={`platform-card ${isSelected ? 'selected' : ''}`} 
        onClick={onClick}
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
          <PlatformCard 
            icon={<FaInstagram size={20} color="#E1306C" />} 
            isSelected={selectedPlatforms.includes("Instagram")}
            onClick={() => handlePlatformClick("Instagram")} 
          />
          <PlatformCard
            icon={<FaTiktok size={20} />} 
            isSelected={selectedPlatforms.includes("TikTok")}
            onClick={() => handlePlatformClick("TikTok")} 
          />
          <PlatformCard
            icon={<FaYoutube size={20} color="#FF0000" />} 
            isSelected={selectedPlatforms.includes("YouTube")}
            onClick={() => handlePlatformClick("YouTube")} 
          />
          <PlatformCard  
            icon={<FaSquareXTwitter size={20} />} 
            isSelected={selectedPlatforms.includes("X")}
            onClick={() => handlePlatformClick("X")} 
          />
        </div>
      </header>
      <div className="nonHeader">
  {/* Render multiple graphs by mapping through graph types */}
  {['Likes', 'Views', 'Shares'].map((graphType) => (
    <GraphComponent
      key={graphType}
      title={graphType}
      data={graphDataMap[graphType]} 
      series={graphSeriesMap(selectedPlatforms)}
    />
  ))}
</div>
    </div>
  );
};

export default AnalyticsPage;
