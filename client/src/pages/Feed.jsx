import React, { useState } from 'react';

const Feed = (props) => {
    const { id, caption, media_type, media_url } = props.feed;
    const [showCaption, setShowCaption] = useState(false);

    let post;

    switch (media_type) {
        case "VIDEO":
            post = (
                <div className="feedContainer" onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                    {media_url ? (
                        <video
                            src={media_url}
                            type="video/mp4"
                            controls
                            playsInline
                        ></video>
                    ) : (
                        <p className="notAvailable">Video not available</p>
                    )}
                    {showCaption && <p className='caption'>{caption}</p>}
                </div>
            );
            break;

        case "CAROUSEL_ALBUM":
            post = (
                <div onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                    {media_url ? (
                        <img 
                            id={id} 
                            src={media_url} 
                            alt={caption} 
                        />
                    ) : (
                        <p className="notAvailable">Image not available</p>
                    )}
                    {showCaption && <p>{caption}</p>}
                </div>
            );
            break;

        default:
            post = (
                <div onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                    {media_url ? (
                        <img 
                            className="img"
                            id={id} 
                            src={media_url} 
                            alt={caption} 
                        />
                    ) : (
                        <p className="notAvailable">Image not available</p>
                    )}
                    {showCaption && <p>{caption}</p>}
                </div>
            );
    }       

    return (
        <React.Fragment>
            {post}
        </React.Fragment>
    );
}

export default Feed;
