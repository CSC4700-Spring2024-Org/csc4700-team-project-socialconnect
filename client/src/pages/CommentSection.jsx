import React, {useState} from 'react';
import '../Styles/Dashboard.css';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import NoAccount from '../components/NoAccount';
import { IoSend } from "react-icons/io5";
import { replyInstagram } from '../features/instaSlice';
import { FaInstagram } from 'react-icons/fa';

const CommentSection = () => {
    const { comments, isLoadingInsta, instaCommentsLoading } = useSelector((state) => state.insta)
    const { user, isLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch()

    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const handleReplyButtonClick = (commentId) => {
        setReplyTo(commentId === replyTo ? null : commentId);
    };

    const handleSendButtonClick = () => {
        if (replyTo !== null && replyContent.trim() !== '') {
            dispatch(replyInstagram({user: user, replyData:{id:replyTo, text:replyContent.trim()}}))
            setReplyTo(null);
            setReplyContent('');
        }
    };
  
    if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected)) {
      return <NoAccount />
    }

    if (isLoadingInsta || instaCommentsLoading || !comments) {
      return <Spinner />
    }

    return (
        <div className='comments-dashboard-container'>
            <h3 className='comments-title'>Newest Comments</h3>
            <div className='all-comments-container'>
                {comments.map((comment) => {
                    const commentDate = new Date(comment.timestamp);
                    const formattedCommentDate = `${commentDate.getMonth() + 1}/${commentDate.getDate()}/${commentDate.getFullYear()}`;
                    return (
                        <div className='comment-container' key={comment.id}>
                            <div className='platform-name-date-container'>
                                <p className='comment-platform'><FaInstagram size = {20} color="#E1306C"/></p>
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
                                    <hr className='replies-divider' data-content='Replies'/>
                                    <div className='all-replies-container'>
                                        {comment.replies.data.map((reply) => {
                                            const replyDate = new Date(reply.timestamp);
                                            const formattedReplyDate = `${replyDate.getMonth() + 1}/${replyDate.getDate()}/${replyDate.getFullYear()}`;
                                            return (
                                                <div className='reply-comment-container' key={reply.id}>
                                                    <div className='platform-name-date-container'>
                                                        <p className='comment-platform'><FaInstagram size = {20} color="#E1306C"/></p>
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
                                                            <IoSend className='send-button' onClick={handleSendButtonClick}/>
                                                        </div>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                </> : <></>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };
  
  export default CommentSection;