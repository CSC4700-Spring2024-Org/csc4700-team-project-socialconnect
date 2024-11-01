import React from 'react'
import Feed from './Feed'
import { useSelector } from 'react-redux'
import NoAccount from '../components/NoAccount';

import './instaFeeds.css'
import Spinner from '../components/Spinner'

const Chart = () => {
  const { instaPage, isLoadingInsta, tiktokPage } = useSelector((state) => state.insta)
  const { user, isLoading } = useSelector((state) => state.auth);
  
  if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
    return <NoAccount />
  }

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