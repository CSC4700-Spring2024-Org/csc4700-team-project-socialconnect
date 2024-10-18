import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Analytics() {
  const { instaPage, isLoadingInsta } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);

  const [instaChartOptions, setInstaChartOptions] = useState({
    background: {
      fill: 'transparent'
    },
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
      fontSize: 18,
      fontFamily: 'Futura',
      color: 'black',
      style: 'bold'
    }
  });

  const [selectedOption, setSelectedOption] = useState('Instagram'); 

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

  const handlePlatformChange = (platform) => {
    setSelectedOption(platform);
    console.log(`Selected option: ${platform}`);
  };

  return (
    <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
      <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
        <div style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <div 
            onClick={() => handlePlatformChange('Instagram')} 
            style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
          >
            <FaInstagram size={20} color="#E1306C" />
            <span style={{ color: 'black', marginLeft: '5px' }}>Instagram</span>
          </div>
          <div 
            onClick={() => handlePlatformChange('TikTok')} 
            style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
          >
            <FaTiktok size={20} />
            <span style={{ color: 'black', marginLeft: '5px' }}>TikTok</span>
          </div>
          <div 
            onClick={() => handlePlatformChange('YouTube')} 
            style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
          >
            <FaYoutube size={20} color="#FF0000" />
            <span style={{ color: 'black', marginLeft: '5px' }}>YouTube</span>
          </div>
          <div 
            onClick={() => handlePlatformChange('X')} 
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FaSquareXTwitter size={20} />
            <span style={{ color: 'black', marginLeft: '5px' }}>X</span>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: 'transparent' }}>
        {selectedOption == 'Instagram' && <AgCharts options={instaChartOptions} />}
      </div>
    </div>
  );
}
