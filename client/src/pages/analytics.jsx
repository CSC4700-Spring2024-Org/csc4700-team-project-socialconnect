import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import { Carousel } from 'react-responsive-carousel';
import '../Styles/carousel.min.css';

export default function Analytics() {
  const { instaPage, isLoadingInsta, tiktokPage, insights, youtubePage } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [selectedDataType, setSelectedDataType] = useState('Views');
  const [chartOptions, setChartOptions] = useState({});
  const navigate = useNavigate();

  const dataTypes = ['Views', 'Likes', 'Shares'];

  useEffect(() => {
    if (!isLoadingInsta && insights) {
      updateChartData();
    }
  }, [isLoadingInsta, insights, selectedPlatform, selectedDataType]);

  const updateChartData = () => {
    let filteredData, yKey, color
    let counts = []
    let dates = []
    switch (selectedPlatform) {
      case 'Instagram':
        filteredData = insights.filter((metric) => {
          if (selectedDataType === 'Views') return metric.name === 'ig_reels_aggregated_all_plays_count';
          if (selectedDataType === 'Shares') return metric.name === 'shares';
        });
        if (selectedDataType === 'Likes') {
          counts = instaPage?.business_discovery?.media?.data.map(post => post.like_count) || []
        } else {
          counts = filteredData.map(item => item.values[0].value);
        }
        dates = instaPage?.business_discovery?.media?.data.map(media => media.timestamp) || [];
        yKey = 'Instagram';
        color = '#FF69B4';
        break;
      case 'TikTok':
        if (tiktokPage) {
          const metric = selectedDataType.slice(0,selectedDataType.length-1).toLowerCase() + "_count"
          counts = tiktokPage.videos.data.videos.map(post => post[metric])
          dates = tiktokPage.videos.data.videos.map(post => new Date(post.create_time*1000))
        }
        yKey = 'TikTok';
        color = '#000000';
        break;
      case 'YouTube':
        if (youtubePage) {
          const metric = selectedDataType.toLowerCase()
          counts = youtubePage.videos.map(post => post.statistics !== null ? Number(post.statistics[metric]) : null)
          dates = youtubePage.videos.map(post => post.contentDetails.videoPublishedAt)
        }
        yKey = 'YouTube';
        color = '#FF0000';
        break;
      case 'X':
        filteredData = [];
        yKey = 'X';
        color = '#1DA1F2';
        break;
    }

    const dynamicData = counts.map((count, index) => ({
      [yKey]: count,
      date: new Date(dates[index]),
    }));

    setChartOptions({
      background: { fill: 'white' },
      axes: [
        { type: 'time', position: 'bottom' },
        { type: 'number', position: 'left', title: { text: selectedDataType, color: 'black' } }
      ],
      data: dynamicData.length ? dynamicData : [{ [yKey]: 0, date: new Date() }],
      series: [{
        type: 'line',
        xKey: 'date',
        yKey: yKey,
        stroke: color,
        marker: { enabled: true, size: 7, fill: color },
        tooltip: {
          enabled: true,
          renderer: (params) => {
            const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric'
            });
            return {
              title: formattedDate,
              content: `${params.datum[yKey]} ${selectedDataType.toLowerCase()}`,
              backgroundColor: color
            };
          }
        }
      }],
      title: {
        text: `${selectedPlatform} ${selectedDataType}`,
        fontSize: 18,
        fontFamily: 'Futura',
        color: 'black',
        style: 'bold'
      }
    });
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
    return <NoAccount />;
  }
  if (isLoadingInsta || !instaPage) {
    return <Spinner />;
  }

  const platformCardColors = { 
    Instagram: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
    TikTok: 'black',      
    YouTube: 'white',       
    X: 'white'          
  };

  const PlatformCard = ({ platform, isConnected, icon, pfp, isSelected, onClick }) => {
    const color = "white";
    
    if (isConnected == true) {
      return (
        <div className={`ap-platform-card ${isSelected ? 'selected' : ''}`} onClick={onClick} style = {{color, height: '70%', width: '23%'}} >
          <div className="profile-container">
            <div className="pc-platform-icon" style={{ background: platformCardColors[platform], height: "100%" }}>
              {icon}
            </div>
            <img src={pfp} style={{ width: '100%', height: '100%', objectFit: "cover" }} />
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={`ap-platform-card disconnected`} onClick={() => navigate('../Profile')} style = {{color, height: '70%', width: '23%'}}>
          <div className="profile-container">
            <div className="pc-platform-icon" style={{ background: "#e0e0e0", height: "100%" }}>
              {icon}
            </div>
            <button className='ap-connect-platform-button' style={{fontSize: 'small'}}>
              Connect Platform
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '0px', height:'10%' }}>
        <PlatformCard
          platform={"Instagram"}
          isConnected={user.instagramConnected}
          icon={<FaInstagram size={15} />}
          pfp={instaPage.business_discovery.profile_picture_url}
          isSelected={selectedPlatform.includes("Instagram")}
          onClick={() => handlePlatformChange("Instagram")}
        />
        <PlatformCard
          platform={"TikTok"}
          isConnected={user.tiktokConnected}
          icon={<FaTiktok size={15} />}
          pfp={tiktokPage.profilePicture}
          isSelected={selectedPlatform.includes("TikTok")}
          onClick={() => handlePlatformChange("TikTok")}
        />
        <PlatformCard
          platform={"YouTube"}
          isConnected={user.youtubeConnected}
          pfp={youtubePage?.profilePicture}
          icon={<FaYoutube size={17} color={"red"} />}
          onClick={() => handlePlatformChange("YouTube")}
        />
        <PlatformCard
          platform={"X"}
          isConnected={false}
          icon={<FaSquareXTwitter size={17} color={"black"} />}
          onClick={() => handlePlatformChange("X")}
        />
      </div>
      <div style={{ flexGrow: 1, overflowY: 'hidden' }}>
        <Carousel
          showArrows={true}
          showStatus={true}
          showIndicators={true}
          infiniteLoop={true}
          onChange={(index) => setSelectedDataType(dataTypes[index])}
        >
          {dataTypes.map((dataType, index) => (
            <div key={index} style={{ height: '100%', backgroundColor: 'white' }}>
              <AgCharts options={chartOptions} style={{ height: '100%' }}/>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}