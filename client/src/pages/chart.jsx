import React, { useState, useEffect, useRef } from 'react'
import Feed from './Feed'
import { useSelector } from 'react-redux'

import './instaFeeds.css'
import Spinner from '../components/Spinner'

const Chart = () => {
  const { instaPage, isLoadingInsta } = useSelector((state) => state.insta)

  if (isLoadingInsta || !instaPage) {
    return <Spinner />
  }
  return (
      <div className='recentposts-container'>
          {instaPage.business_discovery.media.data.map((feed) => (
              <Feed key={feed.id} feed={feed} />
          ))}
      </div>
  );
}

export default Chart;