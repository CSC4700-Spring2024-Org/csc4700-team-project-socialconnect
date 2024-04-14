

// 'use client';
import { AreaChart, Card, List, ListItem } from '@tremor/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const data = [
  {
    date: 'Jan 23',
    Instagram: 232,
    TikTok: 0,
  },
  {
    date: 'Feb 23',
    Instagram: 241,
    TikTok: 0,
  },
  {
    date: 'Mar 23',
    Instagram: 291,
    TikTok: 0,
  },
  {
    date: 'Apr 23',
    Instagram: 101,
    TikTok: 0,
  },
  {
    date: 'May 23',
    Instagram: 318,
    TikTok: 0,
  },
  {
    date: 'Jun 23',
    Instagram: 205,
    TikTok: 0,
  },
  {
    date: 'Jul 23',
    Instagram: 372,
    TikTok: 0,
  },
  {
    date: 'Aug 23',
    Instagram: 341,
    TikTok: 0,
  },
  {
    date: 'Sep 23',
    Instagram: 387,
    TikTok: 120,
  },
  {
    date: 'Oct 23',
    Instagram: 220,
    TikTok: 0,
  },
  {
    date: 'Nov 23',
    Instagram: 372,
    TikTok: 0,
  },
  {
    date: 'Dec 23',
    Instagram: 321,
    TikTok: 0,
  },
];

const summary = [
  {
    name: 'Instagram',
    value: 3273,
  },
  {
    name: 'TikTok',
    value: 120,
  },
];

const valueFormatter = (number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

const statusColor = {
  Instagram: 'bg-purple',
  TikTok: 'bg-purple',
};

export default function Example() {
  return (
    <>
      <Card className="sm:mx-auto sm:max-w-lg">
        <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Follower metrics
        </h3>
        <AreaChart
          data={data}
          index="date"
          categories={['Instagram', 'TikTok']}
          colors={['bg-purple', 'bg-violet']}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={true}
          showGradient={false}
          startEndOnly={true}
          className="mt-6 h-32"
        />
        <List className="mt-2">
          {summary.map((item) => (
            <ListItem key={item.name}>
              <div className="flex items-center space-x-2">
                <span
                  className={classNames(statusColor['Instagram'], 'h-0.5 w-3')}
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