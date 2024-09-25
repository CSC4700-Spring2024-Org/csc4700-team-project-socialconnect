import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';
import '../Styles/Analytics.css';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';

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
        stroke: 'pink',
        marker: {
          enabled: true,
          size: 8,
          fill: 'white',
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
              backgroundColor: 'pink'
            };
          }
        }
      }
    ],
    title: {
      text: 'Instagram Likes',
      fontSize: 18,
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
        const dateObject = new Date(dates[likeCounts.length - index - 1]);
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

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(`Selected option: ${e.target.value}`);
  };

  return (
    <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
      <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
        <select value={selectedOption} onChange={handleDropdownChange} style = {{ backgroundColor: 'transparent', color: 'black' }}>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
        </select>
      </div>
      <div style={{ backgroundColor: 'transparent' }}>
        {selectedOption == 'Instagram' && <AgCharts options={instaChartOptions} /> }
      </div>
    </div>
  );
}
