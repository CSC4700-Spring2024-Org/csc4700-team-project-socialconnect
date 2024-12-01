import React, {useState} from 'react';
import '../Styles/Dashboard.css';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import NoAccount from '../components/NoAccount';
import { IoSend } from "react-icons/io5";
import { replyInstagram } from '../features/instaSlice';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const CommentSection = () => {
    const { comments, isLoadingInsta, instaCommentsLoading, youtubePage } = useSelector((state) => state.insta)
    console.log(youtubePage)
    const { user, isLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch()

    const combinedComments = [
        ...(comments ? comments.map(comment => ({
            timestamp: comment.timestamp,
            id: comment.id,
            username: comment.username,
            text: comment.text,
            replies: comment.replies,
            source: 'Instagram'
        })) : []),
        ...(youtubePage ? youtubePage.videos.flatMap(post => (
            post.comments ? post.comments.items.map(comment => ({
                timestamp: comment.snippet.topLevelComment.snippet.updatedAt,
                id: comment.snippet.topLevelComment.id,
                username: comment.snippet.topLevelComment.snippet.authorDisplayName,
                text: comment.snippet.topLevelComment.snippet.textOriginal,
                replies: null,
                source: 'YouTube'
            })) : []
        )) : [])
    ]
    combinedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    const handleReplyButtonClick = (comment) => {
        setReplyTo(comment.id === replyTo.id ? null : {source : comment.source, id: comment.id});
    };

    const handleSendButtonClick = () => {
        if (replyTo.id !== null && replyContent.trim() !== '') {
            if (replyTo.source === 'Instagram') {
                dispatch(replyInstagram({replyData:{id:replyTo.id, text:replyContent.trim()}}))
            } else if (replyTo.source === 'YouTube') {
                dispatch(replyInstagram({replyData:{id:replyTo.id, text:replyContent.trim()}}))
            }
            setReplyTo(null);
            setReplyContent('');
        }
    };
  
    if (!isLoading && (user && !user.instagramConnected && !user.tiktokConnected && !user.youtubeConnected)) {
      return <NoAccount />
    }

    if (isLoadingInsta || instaCommentsLoading || !comments) {
      return <Spinner />
    }
    console.log(combinedComments)

    return (
        <div className='comments-dashboard-container'>
            <h3 className='comments-title'>Comments</h3>
            <div className='all-comments-container'>
                {combinedComments.map((comment) => {
                    const commentDate = new Date(comment.timestamp);
                    const formattedCommentDate = `${commentDate.getMonth() + 1}/${commentDate.getDate()}/${commentDate.getFullYear()}`;
                    return (
                        <div className={`comment-container ${comment.source}`} key={comment.id}>
                            <div className='platform-name-date-container'>
                                <p className='comment-platform'>{comment.source === 'Instagram' ? <FaInstagram size = {20} color="#E1306C"/> : <FaYoutube size = {20} color='#ff0000' />}</p>
                                <p className='comment-username'>{comment.username}</p>
                                <p className='comment-date'>{formattedCommentDate}</p>
                            </div>
                            <p className='comment-text'>{comment.text}</p>
                            <button className='reply-button' onClick={() => handleReplyButtonClick(comment)}>
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
                                                    <button className='reply-button' onClick={() => handleReplyButtonClick(reply)}>
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