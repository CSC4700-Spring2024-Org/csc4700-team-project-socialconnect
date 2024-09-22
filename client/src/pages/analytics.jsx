// import { AreaChart, Card, List, ListItem } from '@tremor/react';
// import Spinner from '../components/Spinner';
// import { useSelector } from 'react-redux'
// import NoAccount from '../components/NoAccount';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ');
// }

// const valueFormatter = (number) =>
//   `${Intl.NumberFormat('us').format(number).toString()}`;

// const statusColor = {
//   //TikTok: 'bg-stone-500',
//   Instagram: 'bg-pink-500',
//   //Youtube:'bg-red-500',
// };

// // Define your custom tooltip component
// const CustomTooltip = ({ active, payload, label }) => {
//   // Check if the tooltip should be displayed (active)
//   if (active && payload && payload.length > 0) {
//       // Access the data point
//       const dataPoint = payload[0]; // This is typically the data for the hovered point

//       // Extract the value, data key (category), and label (date)
//       const value = dataPoint.value;
//       const dataKey = dataPoint.dataKey;
//       const category = dataPoint.name;

//       // Render the custom tooltip content
//       return (
//           <div className="custom-tooltip">
//               <p>{`${label}`}</p>
//               {/* <p>{`Category: ${category}`}</p> */}
//               <p>{`${value} Likes`}</p>
//           </div>
//       );
//   }

//   // If the tooltip is not active, return null to hide the tooltip
//   return null;
// };

// export default function Analytics() {
//   const { instaPage, isLoadingInsta } = useSelector((state) => state.insta)
//   const { user, isLoading } = useSelector((state) => state.auth);
  
//   if (!isLoading && (user && !user.instaRefresh)) {
//     return <NoAccount />
//   }
//   if (isLoadingInsta || !instaPage) {
//     return <Spinner />
//   }
  
//   const likeCounts = instaPage.business_discovery.media.data.map(media => media.like_count);

//   const dates = instaPage.business_discovery.media.data.map(media => media.timestamp);


//   const data = []
//   for (let i = 0; i < likeCounts.length; i++) {
//     // Create a Date object from the ISO 8601 date string
//     const dateObject = new Date(dates[likeCounts.length - i - 1]);

//     // Extract the month, day, and year from the Date object
//     const month = dateObject.getMonth() + 1; // Months are zero-based, so we add 1
//     const day = dateObject.getDate();
//     const year = dateObject.getFullYear();

//     // Format the date as MM/DD/YYYY
//     const formattedDate = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;

//     data[i] = {
//       Instagram : likeCounts[likeCounts.length - i - 1],
//       date : formattedDate,
//       TikTok : 0,
//       Youtube : 0
//     }
//   }

//   const likesSum = likeCounts.reduce((accumulator, currentValue) => {
//     return accumulator + currentValue;
//   }, 0); // The initial value of the accumulator is set to 0


//   const summary = [
//     {
//       name: 'Instagram',
//       value: likesSum,
//     }//,
//     // {
//     //   name: 'TikTok',
//     //   value: 0,
//     // },
//     // {
//     //   name: 'Youtube',
//     //   value: 0,
//     // },
//   ];

//   return (
//     <>
//     <Card className="analytics-card">
//       <h3 className="likes-header">Likes</h3>
//       <div className="chart-container">
//         <AreaChart
//           data={data}
//           index="date"
//           categories={['TikTok', 'Instagram', 'Youtube']}
//           colors={['emerald', 'pink', 'red']}
//           valueFormatter={valueFormatter}
//           showLegend={false}
//           showYAxis={true}
//           showGradient={true}
//           startEndOnly={true}
//           className="analytics-area-chart"
//           showTooltip={true}
//           customTooltip={CustomTooltip}
//         />
//       </div>
//       <List className="analytics-list">
//         {summary.map((item) => (
//           <ListItem key={item.name}>
//             <div className="list-item-div">
//               <span
//                 className={classNames(statusColor[item.name], 'list-item-span')}
//                 aria-hidden={true}
//               />
//               <span>{item.name}</span>
//             </div>
//             <span className="likes-count">
//               {valueFormatter(item.value)}
//             </span>
//           </ListItem>
//         ))}
//       </List>
//     </Card>
//   </>
//   );
// }





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
        title: { text: 'Likes' }, 
      }
    ],
    data: [], 
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'Instagram',
        stroke: '#0072B5',
        marker: {
          enabled: true,
          size: 8,
          fill: '#0072B5',
        },
        tooltip: {
          enabled: true, // Enable tooltips
          renderer: (params) => {
            const yValue = params.yValue; // Access yValue
            return {
              title: 'Data Point',
              content: `Date: ${params.xValue}<br/>Likes: ${yValue}`
            };
          },
        },
      }
    ],
    title: {
      text: 'Instagram Likes',
      fontSize: 18,
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
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <select value={selectedOption} onChange={handleDropdownChange}>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
        </select>
      </div>
      <div >
        {selectedOption == 'Instagram' && <AgCharts options={instaChartOptions} /> }
      </div>
    </div>
  );
}
