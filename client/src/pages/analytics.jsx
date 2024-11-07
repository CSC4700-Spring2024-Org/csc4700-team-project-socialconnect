import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';
import { useSelector } from 'react-redux';
import NoAccount from '../components/NoAccount';
import Spinner from '../components/Spinner';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import { Carousel } from 'react-responsive-carousel';
import '../Styles/carousel.min.css';

export default function Analytics() {
  const { instaPage, isLoadingInsta, tiktokPage, insights } = useSelector((state) => state.insta);
  const { user, isLoading } = useSelector((state) => state.auth);
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [selectedDataType, setSelectedDataType] = useState('Views');
  const [chartOptions, setChartOptions] = useState({});

  const dataTypes = ['Views', 'Likes', 'Shares'];

  useEffect(() => {
    if (!isLoadingInsta && insights) {
      updateChartData();
    }
  }, [isLoadingInsta, insights, selectedPlatform, selectedDataType]);

  const updateChartData = () => {
    let filteredData, yKey, color, counts, dates;

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
        const metric = selectedDataType.slice(0,selectedDataType.length-1).toLowerCase() + "_count"
        counts = tiktokPage.map(post => post[metric])
        dates = tiktokPage.map(post => new Date(post.create_time*1000))
        yKey = 'TikTok';
        color = '#000000';
        break;
      case 'YouTube':
        filteredData = [];
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '0px', height:'10%' }}>
        <div onClick={() => handlePlatformChange('Instagram')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <FaInstagram size={20} color="#E1306C" />
          <span style={{ color: 'black', marginLeft: '5px' }}>Instagram </span>
        </div>
        <div onClick={() => handlePlatformChange('TikTok')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <FaTiktok size={20} />
          <span style={{ color: 'black', marginLeft: '5px' }}>TikTok </span>
        </div>
        <div onClick={() => handlePlatformChange('YouTube')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <FaYoutube size={20} color="#FF0000" />
          <span style={{ color: 'black', marginLeft: '5px' }}>YouTube </span>
        </div>
        <div onClick={() => handlePlatformChange('X')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <FaSquareXTwitter size={20} />
          <span style={{ color: 'black', marginLeft: '5px' }}>X </span>
        </div>
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
          <div key={index} style={{ height: '100%' }}>
            <AgCharts options={chartOptions} style={{ height: '90%' }}/>
          </div>
        ))}
      </Carousel>
       </div>
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { AgCharts } from 'ag-charts-react';
// import { useSelector } from 'react-redux';
// import NoAccount from '../components/NoAccount';
// import Spinner from '../components/Spinner';
// import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
// import { FaSquareXTwitter } from "react-icons/fa6";

// export default function Analytics() {
//   const { instaPage, isLoadingInsta, insights } = useSelector((state) => state.insta);
//   const { user, isLoading } = useSelector((state) => state.auth);
//   console.log(insights)

  

//   const [instaChartOptions, setInstaChartOptions] = useState({
//     background: {
//       fill: 'transparent'
//     },
//     axes: [
//       {
//         type: 'time',
//         position: 'bottom',
//       },
//       {
//         type: 'number',
//         position: 'left',
//         title: { 
//           text: 'Views',
//           color: 'black'
//         }, 
//       }
//     ],
//     data: [], 
//     series: [
//       {
//         type: 'line',
//         xKey: 'date',
//         yKey: 'Instagram',
//         stroke: '#FF69B4',
//         marker: {
//           enabled: true,
//           size: 7,
//           fill: '#FF69B4'
//         },
//         tooltip: {
//           enabled: true,
//           renderer: (params) => {
//             const formattedDate = new Date(params.datum.date).toLocaleDateString('en-US', {
//               year: 'numeric',
//               month: 'short',
//               day: 'numeric'
//             });
//             return {
//               title: formattedDate,
//               content: `${params.datum.Instagram} views`,
//               backgroundColor: '#FF69B4'
//             };
//           }
//         }
//       }
//     ],
//     title: {
//       text: 'Instagram Views',
//       fontSize: 18,
//       fontFamily: 'Futura',
//       color: 'black',
//       style: 'bold'
//     }
//   });

//   const [selectedOption, setSelectedOption] = useState('Instagram'); 

//   useEffect(() => {
//     console.log("Insights Data:", insights); // Check if insights contains expected data structure
    
//     if (!isLoadingInsta && insights) {
//       const filteredArr = insights.filter((metric) => metric.name === 'ig_reels_aggregated_all_plays_count')
//       console.log(filteredArr)
//       const likeCounts = filteredArr.map(
//         media => media.values[0].value
//       );
//       const dates = instaPage.business_discovery.media.data.map(media => media.timestamp);
  
//       const dynamicData = likeCounts.map((likeCount, index) => {
//         const dateObject = new Date(dates[index]);
//         return {
//           Instagram: likeCount,
//           date: dateObject,
//           TikTok: 0, 
//           Youtube: 0 
//         };
//       });
  
//       setInstaChartOptions((prevOptions) => ({
//         ...prevOptions,
//         data: dynamicData.length ? dynamicData : [{ Instagram: 0, date: new Date(), TikTok: 0, Youtube: 0 }]
//       }));
//     }
//   }, [isLoadingInsta, insights]);
  

//   if (!isLoading && (user && !user.instaRefresh)) {
//     return <NoAccount />;
//   }
//   if (isLoadingInsta || !instaPage) {
//     return <Spinner />;
//   }

//   const handlePlatformChange = (platform) => {
//     setSelectedOption(platform);
//     console.log(`Selected option: ${platform}`);
//   };

//   return (
//     <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
//       <div style={{ backgroundColor: 'transparent', position: 'relative' }}>
//         <div style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
//           <div 
//             onClick={() => handlePlatformChange('Instagram')} 
//             style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
//           >
//             <FaInstagram size={20} color="#E1306C" />
//             <span style={{ color: 'black', marginLeft: '5px' }}>Instagram</span>
//           </div>
//           <div 
//             onClick={() => handlePlatformChange('TikTok')} 
//             style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
//           >
//             <FaTiktok size={20} />
//             <span style={{ color: 'black', marginLeft: '5px' }}>TikTok</span>
//           </div>
//           <div 
//             onClick={() => handlePlatformChange('YouTube')} 
//             style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
//           >
//             <FaYoutube size={20} color="#FF0000" />
//             <span style={{ color: 'black', marginLeft: '5px' }}>YouTube</span>
//           </div>
//           <div 
//             onClick={() => handlePlatformChange('X')} 
//             style={{ display: 'flex', alignItems: 'center' }}
//           >
//             <FaSquareXTwitter size={20} />
//             <span style={{ color: 'black', marginLeft: '5px' }}>X</span>
//           </div>
//         </div>
//       </div>
//       <div style={{ backgroundColor: 'transparent' }}>
//         {selectedOption == 'Instagram' && <AgCharts options={instaChartOptions} />}
//       </div>
//     </div>
//   );
// }
