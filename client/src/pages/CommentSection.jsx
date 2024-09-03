// components/CommentSection.js
import React, {useState} from 'react';
import '../Styles/Dashboard.css';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import NoAccount from '../components/NoAccount';
import { IoSend } from "react-icons/io5";

const CommentSection = () => {
    const { comments, isLoadingInsta } = useSelector((state) => state.insta)
    const { user, isLoading } = useSelector((state) => state.auth);

    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const handleReplyButtonClick = (commentId) => {
        setReplyTo(commentId === replyTo ? null : commentId);
    };

    const handleSendButtonClick = () => {
        if (replyTo !== null && replyContent.trim() !== '') {
            console.log(`Replying to ${replyTo}: ${replyContent}`);
            setReplyTo(null);
            setReplyContent('');
        }
    };
  
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
                            <button className='reply-button' onClick={() => handleReplyButtonClick(comment.id)}>
                                {replyTo === comment.id ? 'Cancel' : 'Reply'}
                            </button>
                            {replyTo === comment.id &&
                                <div className='reply-input-container'>
                                    <input
                                        type='text'
                                        className='reply-input'
                                        placeholder='Reply...'
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                    <IoSend className='send-button' onClick={handleSendButtonClick}/>
                                </div>
                            }
                            {comment.replies ?
                                <>
                                    <footer className='replies-divider'></footer>
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
                                                <button className='reply-button' onClick={() => handleReplyButtonClick(reply.id)}>
                                                    {replyTo === reply.id ? 'Cancel' : 'Reply'}
                                                </button>
                                                {replyTo === reply.id &&
                                                    <div className='reply-input-container'>
                                                        <input
                                                            type='text'
                                                            className='reply-input'
                                                            placeholder='Reply...'
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                        />
                                                        <button className='send-button' onClick={handleSendButtonClick}>Send</button>
                                                    </div>
                                                }
                                            </div>
                                        );
                                    })}
                                </> : <></>}
                        </div>
                    );
                })
            })}
        </div>
    );
  };
  
  export default CommentSection;