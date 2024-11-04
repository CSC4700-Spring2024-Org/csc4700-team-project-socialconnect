import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

const Feed = (props) => {
    const { id, caption, media_type, media_url, source } = props.feed;
    const [showCaption, setShowCaption] = useState(false);
    const [embedHTML, setEmbedHTML] = useState("");
    const [tiktokScriptLoaded, setTiktokScriptLoaded] = useState(false);
    
    useEffect(() => {
        if (source === 'TikTok') {
            getTikTokEmbedHTML().then(html => setEmbedHTML(html));
        }
    }, [props.feed]);

    useEffect(() => {
        if (embedHTML && source === 'TikTok') {
          const script = document.createElement('script');
          script.src = 'https://www.tiktok.com/embed.js';
          script.async = true;
          script.onload = () => setTiktokScriptLoaded(true);
          document.body.appendChild(script);
          
          return () => {
            document.body.removeChild(script);
            setTiktokScriptLoaded(false);
          };
        }
    }, [embedHTML, source]);

    const sourceToIconMap = {
        'Instagram' : <FaInstagram size={20} color="#E1306C" />,
        'TikTok' : <FaTiktok size={20} />,
        'YouTube' : <FaYoutube size={20} color="#FF0000" />,
        'X' : <FaSquareXTwitter size={20} />
    }

    
    async function getTikTokEmbedHTML() {
        try {
            const response = await fetch(media_url);
            const data = await response.json();
            
            let embedHTML = data.html;
            embedHTML = data.html.replace('style=\"max-width:605px; min-width:325px;\"', "");
            return embedHTML;
        } catch (error) {
            console.error("Failed to fetch TikTok embed HTML:", error);
            return "<p>Video not available</p>";
        }
    }

    let post;

    switch (media_type) {
        case "VIDEO":
            if (source === "TikTok") {
                post = (
                    <div className="feedContainer" onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                        <p className='sourceText'>{sourceToIconMap[source]} {source}</p>
                        {tiktokScriptLoaded && embedHTML ? (
                            <div dangerouslySetInnerHTML={{ __html: embedHTML }}/>
                        ) : (
                            <p className="notAvailable">Video not available</p>
                        )}
                        {showCaption && <p className='caption'>{caption}</p>}
                    </div>
                );
            } else {
                // Use video tag for other platforms
                post = (
                    <div className="feedContainer" onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                        <p className='sourceText'>{sourceToIconMap[source]} {source}</p>
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
            }
            break;

        case "CAROUSEL_ALBUM":
            post = (
                <div onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}>
                    <p className='sourceText'>{sourceToIconMap[source]} {source}</p>
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
                    <p className='sourceText'>{sourceToIconMap[source]} {source}</p>
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
