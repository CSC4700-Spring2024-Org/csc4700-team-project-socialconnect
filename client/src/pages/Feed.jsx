import React, { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

const Feed = (props) => {
    const { id, caption, media_type, media_url, source } = props.feed;
    const [showCaption, setShowCaption] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const feedRef = useRef(null);

    const sourceToIconMap = {
        'Instagram' : <FaInstagram size={20} color="#E1306C" />,
        'TikTok' : <FaTiktok size={20} />,
        'YouTube' : <FaYoutube size={20} color="#FF0000" />,
        'X' : <FaSquareXTwitter size={20} />
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        if (feedRef.current) {
            observer.observe(feedRef.current);
        }

        return () => {
            if (feedRef.current) {
                observer.unobserve(feedRef.current);
            }
        };
    }, []);

    let post;

    switch (media_type) {
        case "VIDEO":
            if (source === "TikTok") {
                post = (
                    <div className="feedContainer" ref={feedRef} style= {{border:'1px solid black'}}>
                        <p className='sourceText'>{sourceToIconMap[source]}</p>
                        {isVisible && media_url ? <iframe height="100%" width= "100%" src={`https://www.tiktok.com/player/v1/${media_url}?description=1&loop=1&autoplay=1`} allow="fullscreen"></iframe> : <p>Video Not Available</p>}
                        <br />
                    </div>
                );
            } else if (source === "YouTube") {
                post = (
                    <div className="feedContainer" ref={feedRef} style= {{border:'1px solid red'}}>
                        <p className='sourceText'>{sourceToIconMap[source]}</p>
                        {isVisible && media_url ? <iframe height="100%" width= "100%" src={`https://youtube.com/embed/${media_url}?showinfo=0&loop=1&controls=0&modestbranding=1`} allow="autoplay; fullscreen"></iframe> : <p>Video Not Available</p>}
                        <br />
                    </div>
                );
            } else {
                post = (
                    <div className="feedContainer" onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)} ref={feedRef} style= {{border:'1px solid #E1306C'}}>
                        <p className='sourceText'>{sourceToIconMap[source]}</p>
                        {isVisible && media_url ? (
                            <video
                                src={media_url}
                                type="video/mp4"
                                controls
                                playsInline
                                autoPlay
                                loop
                            ></video>
                        ) : (
                            <p className="notAvailable">Video not available</p>
                        )}
                        {showCaption && <p className='caption'>{caption}</p>}
                    </div>
                );
            }
            break;

        case "CAROUSEL_ALBUM":
            post = (
                <div onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                    <p className='sourceText'>{sourceToIconMap[source]}</p>
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
                    <p className='sourceText'>{sourceToIconMap[source]}</p>
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
