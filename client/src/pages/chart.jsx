import React from 'react'
import Feed from './Feed'
import { useSelector } from 'react-redux'
import NoAccount from '../components/NoAccount';

import '../Styles/instaFeeds.css'
import Spinner from '../components/Spinner'

const Chart = () => {
  const { instaPage, isLoadingInsta, tiktokPage } = useSelector((state) => state.insta)
  console.log(tiktokPage)
  const { user, isLoading } = useSelector((state) => state.auth);

  if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
    return <NoAccount />
  }

  if (isLoadingInsta || !instaPage || !tiktokPage) {
    return <Spinner />
  }

  const combinedPosts = [
    ...tiktokPage.map(post => ({
      timestamp: post.create_time * 1000,
      source: 'TikTok',
      caption: post.video_description,
      media_url: post.id,
      media_type: 'VIDEO'
    })),
    ...instaPage.business_discovery.media.data.map(post => ({
      ...post,
      timestamp: post.timestamp,
      source: 'Instagram'
    }))
  ];
  
  combinedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return (
      <div className='recentposts-container'>
          {combinedPosts.map((feed) => (
              <Feed key={feed.id} feed={feed} />
          ))}
      </div>
  );
}

export default Chart;