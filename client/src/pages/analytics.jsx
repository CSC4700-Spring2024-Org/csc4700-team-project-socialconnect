// 'use client';
import { AreaChart, Card, List, ListItem } from '@tremor/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const data = [
  {
    date: 'Jan 1',
    TikTok: 12,
    Instagram: 0,
    Youtube: 20,
  },
  {
    date: 'Feb 1',
    TikTok: 241,
    Instagram: 0,
    Youtube: 20,
  },
  {
    date: 'Mar 1',
    TikTok: 291,
    Instagram: 0,
    Youtube: 500,
  },
  {
    date: 'Apr 1',
    TikTok: 101,
    Instagram: 0,
    Youtube: 100,
  },
  {
    date: 'May 1',
    TikTok: 318,
    Instagram: 0,
    Youtube: 200,
  },
  {
    date: 'Jun 1',
    TikTok: 205,
    Instagram: 0,
    Youtube: 400,
  },
  {
    date: 'Jul 1',
    TikTok: 372,
    Instagram: 0,
    Youtube: 20,
  },
  {
    date: 'Aug 1',
    TikTok: 341,
    Instagram: 0,
    Youtube: 20,
  },
  {
    date: 'Sep 1',
    TikTok: 387,
    Instagram: 120,
    Youtube: 20,
  },
  {
    date: 'Oct 1',
    TikTok: 220,
    Instagram: 0,
    Youtube: 20,
  },
  {
    date: 'Nov 1',
    TikTok: 372,
    Instagram: 0,
    Youtube: 20,
  },
  {
    date: 'Dec 31',
    TikTok: 321,
    Instagram: 0,
    Youtube: 20,
  },
];

const summary = [
  {
    name: 'TikTok',
    value: 3273,
  },
  {
    name: 'Instagram',
    value: 120,
  },
  {
    name: 'Youtube',
    value: 1360,
  },
];

const valueFormatter = (number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

const statusColor = {
  TikTok: 'bg-stone-500',
  Instagram: 'bg-pink-500',
  Youtube:'bg-red-500',
};

export default function Example() {
  return (
    <>
      <Card className="sm:mx-auto sm:max-w-lg">
        <h3 className="font-medium text-tremor-content-strong:text-tremor-content-strong">
          Follower metrics
        </h3>
        <AreaChart
          data={data}
          index="date"
          categories={['TikTok', 'Instagram','Youtube']}
          colors={['emerald', 'pink','red']}
          valueFormatter={valueFormatter}
          showLegend={true}
          showYAxis={false}
          showGradient={false}
          startEndOnly={true}
          className="mt-6 h-32"
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