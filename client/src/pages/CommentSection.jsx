// components/CommentSection.js
import React from 'react';
import '../Styles/Dashboard.css';

const CommentSection = () => {
    // Sample list of comments with user, platform, and comment information
    const comments = [
      { user: 'User1', platform: 'Twitter', comment: 'This is the first comment.' },
      { user: 'User2', platform: 'Facebook', comment: 'This is the second comment.' },
      { user: 'User3', platform: 'Instagram', comment: 'This is the third comment.' },
      // Add more comments as needed
    ];
  
    return (
      <div className="comment-section-container">
        <div className="comment-section">
          <h2 className="comment-header">Comments</h2>
          <ul className="comment-list">
            {comments.map((comment, index) => (
              <li key={index} className="comment-item">
                <strong>{comment.user}</strong> from {comment.platform}: {comment.comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default CommentSection;