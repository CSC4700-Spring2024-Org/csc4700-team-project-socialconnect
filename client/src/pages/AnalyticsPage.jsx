import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { AgCharts } from 'ag-charts-react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import '../Styles/AnalyticsPage.css';

const AnalyticsPage = () => {
  const { instaPage, isLoadingInsta } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);


  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
  };

  const [instaChartOptions, setInstaChartOptions] = useState({
    axes: [
      {
        type: 'time',
        position: 'bottom',
        label: {
          format: '%b'
        }
      },
      {
        type: 'number',
        position: 'left',
        title: { 
          text: 'Likes',
          color: 'black'
        }, 
      }
    ],
    data: [], 
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'Instagram',
        stroke: '#FF69B4',
        marker: {
          enabled: true,
          size: 7,
          fill: '#FF69B4'
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
              content: `${params.datum.Instagram} likes`,
              backgroundColor: '#FF69B4'
            };
          }
        }
      }
    ],
    title: {
      text: 'Instagram Likes',
      textAlign: 'left',
      fontSize: 18,
      fontFamily: 'Futura',
      color: 'black',
      style: 'bold'
    }
  });



  useEffect(() => {
    if (!isLoadingInsta && instaPage) {
      const likeCounts = instaPage.business_discovery.media.data.map(media => media.like_count);
      const dates = instaPage.business_discovery.media.data.map(media => media.timestamp);

      const dynamicData = likeCounts.map((likeCount, index) => {
        const dateObject = new Date(dates[index]);
        return {
          Instagram: likeCount,
          date: dateObject,
          TikTok: 0, 
          Youtube: 0 
        };
      });

      setInstaChartOptions((prevOptions) => ({
        ...prevOptions,
        data: dynamicData
      }));
    }
  }, [isLoadingInsta, instaPage]); 

  if (!isLoading && (user && !user.instaRefresh)) {
    return <NoAccount />;
  }
  if (isLoadingInsta || !instaPage) {
    return <Spinner />;
  }


  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Analytics</h1>
      </header>

      <div className="social-media-platforms">
        <PlatformCard 
          icon={<FaInstagram size={20} color="#E1306C" />} 
          isSelected={selectedPlatform === "Instagram"}
          onClick={() => handlePlatformClick("Instagram")} 
        />
        <PlatformCard
          icon={<FaTiktok size={20}/>} 
          isSelected={selectedPlatform === "TikTok"}
          onClick={() => handlePlatformClick("TikTok")} 
        />
        <PlatformCard
          icon={<FaYoutube size={20} color="#FF0000"/>} 
          isSelected={selectedPlatform === "YouTube"}
          onClick={() => handlePlatformClick("YouTube")} 
        />
        <PlatformCard  
          icon={<FaSquareXTwitter size={20} />} 
          isSelected={selectedPlatform === "X"}
          onClick={() => handlePlatformClick("X")} 
        />
      </div>

      <div className="analytics-charts">
            <AgCharts options={instaChartOptions} />
      </div>

      {/* <div className="demographics">
        <h3>Demographics</h3>
      </div> */}
    </div>
  );
};

const PlatformCard = ({ icon, isSelected, onClick }) => {
  return (
    <div 
      className={`platform-card ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      {icon}
      {/* <h3>{platform}</h3> */}
    </div>
  );
};

export default AnalyticsPage;
