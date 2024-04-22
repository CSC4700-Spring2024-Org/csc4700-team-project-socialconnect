// 'use client';
import { AreaChart, Card, List, ListItem } from '@tremor/react';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const valueFormatter = (number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

const statusColor = {
  //TikTok: 'bg-stone-500',
  Instagram: 'bg-pink-500',
  //Youtube:'bg-red-500',
};

// Define your custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  // Check if the tooltip should be displayed (active)
  if (active && payload && payload.length > 0) {
      // Access the data point
      const dataPoint = payload[0]; // This is typically the data for the hovered point

      // Extract the value, data key (category), and label (date)
      const value = dataPoint.value;
      const dataKey = dataPoint.dataKey;
      const category = dataPoint.name;

      // Render the custom tooltip content
      return (
          <div className="custom-tooltip">
              <p>{`${label}`}</p>
              {/* <p>{`Category: ${category}`}</p> */}
              <p>{`${value} Likes`}</p>
          </div>
      );
  }

  // If the tooltip is not active, return null to hide the tooltip
  return null;
};

export default function Analytics() {
  const { instaPage, isLoadingInsta, isSuccessInsta } = useSelector((state) => state.insta)
  
  if (isLoadingInsta || !instaPage) {
    return <Spinner />
  }
  
  const likeCounts = instaPage.business_discovery.media.data.map(media => media.like_count);

  const dates = instaPage.business_discovery.media.data.map(media => media.timestamp);


  const data = []
  for (let i = 0; i < likeCounts.length; i++) {
    // Create a Date object from the ISO 8601 date string
    const dateObject = new Date(dates[likeCounts.length - i - 1]);

    // Extract the month, day, and year from the Date object
    const month = dateObject.getMonth() + 1; // Months are zero-based, so we add 1
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();

    // Format the date as MM/DD/YYYY
    const formattedDate = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;

    data[i] = {
      Instagram : likeCounts[likeCounts.length - i - 1],
      date : formattedDate,
      TikTok : 0,
      Youtube : 0
    }
  }

  const likesSum = likeCounts.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0); // The initial value of the accumulator is set to 0


  const summary = [
    {
      name: 'Instagram',
      value: likesSum,
    }//,
    // {
    //   name: 'TikTok',
    //   value: 0,
    // },
    // {
    //   name: 'Youtube',
    //   value: 0,
    // },
  ];

  return (
    <>
      <Card className="sm:mx-auto sm:max-w-lg">
        <h3 className="font-medium text-tremor-content-strong:text-tremor-content-strong">
          Likes
        </h3>
        <AreaChart
          data={data}
          index="date"
          //categories={['TikTok', 'Instagram','Youtube']}
          //colors={['emerald', 'pink','red']}
          categories={['Instagram']}
          colors={['pink']}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={true}
          showGradient={true}
          startEndOnly={true}
          className="mt-6 h-32"
          showTooltip={true}
          customTooltip={CustomTooltip}
        />
        <List className="mt-2">
          {summary.map((item) => (
            <ListItem key={item.name}>
              <div className="flex items-center space-x-2">
                <span
                  className={classNames(statusColor[item.name], 'h-0.5 w-3')}
                  aria-hidden={true}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {valueFormatter(item.value)}
              </span>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}