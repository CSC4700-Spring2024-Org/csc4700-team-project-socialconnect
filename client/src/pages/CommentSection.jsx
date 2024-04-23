// components/CommentSection.js
import React from 'react';
import '../Styles/Dashboard.css';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import NoAccount from '../components/NoAccount';

const CommentSection = () => {
    // Sample list of comments with user, platform, and comment information
    const { comments, isLoadingInsta } = useSelector((state) => state.insta)
    const { user, isLoading } = useSelector((state) => state.auth);
  
    if (!isLoading && (user && !user.instaRefresh)) {
      return <NoAccount />
    }

    if (isLoadingInsta || !comments) {
      return <Spinner />
    }

    return (
        <div className='comments-dashboard-container'>
            <h3 className='comments-title'>Newest Comments</h3>
            {comments.map((commentObj) => {
              return commentObj.map((comment) => {
                const commentDate = new Date(comment.timestamp);
                const formattedCommentDate = `${commentDate.getMonth() + 1}/${commentDate.getDate()}/${commentDate.getFullYear()}`;            
                return (
                    <div className='comment-container' key={comment.id}>
                        <div className='name-date-container'>
                            <p className='comment-username'>{comment.username}</p>
                            <p className='comment-date'>{formattedCommentDate}</p>
                        </div>
                        <p className='comment-text'>{comment.text}</p>
                        <footer></footer>
                        {comment.replies ? 
                        <>
                            <div className='replies-header'>Replies</div>
                            {comment.replies.data.map((reply) => {
                                const replyDate = new Date(reply.timestamp);
                                const formattedReplyDate = `${replyDate.getMonth() + 1}/${replyDate.getDate()}/${replyDate.getFullYear()}`;         
                                return (
                                    <div className='reply-comment-container' key={reply.id}>
                                        <div className='name-date-container'>
                                            <p className='comment-username'>{reply.username}</p>
                                            <p className='comment-date'>{formattedReplyDate}</p>
                                        </div>
                                        <p className='comment-text'>{reply.text}</p>
                                        <footer></footer>
                                    </div>
                                );
                            })}
                        </> : <></>}
                    </div>
                );})
            })}
        </div>
      );
  };
  
  export default CommentSection;