import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import DragNdrop from '../components/DragNDrop';
import '../Styles/Post.css'
import { useSelector } from 'react-redux';
import PostingProgressBar from '../components/PostingProgressBar';
import NextButton from '../components/NextButton';
import { CSSTransition } from 'react-transition-group'
import BackButton from '../components/BackButton';
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import instaService from '../features/instaService';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { FaSquareXTwitter } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';


const Post = () => {
    const [files, setFiles] = useState([]);
    const [currStage, setCurrStage] = useState(1)
    const [postData, setPostData] = useState({caption:'',location:'',mentions:''})
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [postLinks, setPostLinks] = useState([])
    const [isFuturePost, setIsFuturePost] = useState(false)
    const [dateTime, setDateTime] = useState('')


    const { user, isError, isSuccess, isLoading } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      if (params.get('datetime')) {
          setIsFuturePost(true);
          setDateTime(formatDate(new Date(decodeURIComponent(params.get('datetime')))));
      } else {
          setDateTime(formatDate(new Date()));
      }
    }, [location.search]);

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    const platformColors = {
      Instagram: '#FF69B4', 
      TikTok: 'black',      
      YouTube: 'white',       
      X: 'black'          
    };
    const platforms = [
      { name: 'Instagram', icon: <FaInstagram style={{color: platformColors["Instagram"]}} /> },
      { name: 'TikTok', icon: <FaTiktok style={{color: platformColors["TikTok"]}} /> },
      { name: 'YouTube', icon: <FaYoutube style={{color: platformColors["YouTube"]}} /> },
      { name: 'X', icon: <FaSquareXTwitter style={{color: platformColors["X"]}} /> }
    ];

    const togglePlatform = (platform) => {
      setSelectedPlatforms((prev) =>
        prev.includes(platform)
          ? prev.filter((p) => p !== platform)
          : [...prev, platform]
      );
    };

    const handlePost = async () => {        
      const formData = new FormData();
    
      files.forEach((file) => {
        formData.append('files', file);
      });
    
      formData.append(
        'post',
        new Blob(
          [JSON.stringify({
            urls: files.map((file) => `https://posts.danbfrost.com/${file.name}`),
            caption: postData.caption,
            location: postData.location,
            taggedUsers: postData.mentions,
            postToInstagram: selectedPlatforms.includes('Instagram'),
            postToTiktok: selectedPlatforms.includes('TikTok'),
            postToYoutube: selectedPlatforms.includes('YouTube')
          })],
          { type: 'application/json' }
        )
      );

      try {
        const res = await (isFuturePost ? instaService.createFuturePost(formData, new Date(dateTime).toISOString()) : instaService.createInstagramPost(formData));
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          if (!isFuturePost) {
            setPostLinks((prev) => [...prev, { Instagram: res.data.instagramLink}, { YouTube: res.data.youtubeLink }])
          }
          setCurrStage((prev) => prev + 1)
        }
      } catch (error) {
        console.error('Error posting:', error);
        toast.error('Failed to post.');
      }
    }    

    useEffect(() => {
      if (!isLoading) {
        if (isSuccess && user) {
          navigate(`${location.pathname}${location.search}`);
        } else if (isError || (!isSuccess && !user)) {
          navigate('/login');
        }
      }
    }, [user, isSuccess, isError, navigate, isLoading]);

      return (
        <>
          <CSSTransition
            in={currStage === 1}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="post-container">
              <div className='post-content-container'>
                <h2 className='post-container-header'>Upload Content Here</h2>
                <DragNdrop onFilesSelected={setFiles} width="50%" height="60%" />
              </div>
              <div className='post-bottom-container'>
                <div className='buttons-container'>
                  <div className="next-button-container">
                    <NextButton show={files.length > 0} onClick={() => setCurrStage(prev => prev + 1)}/>
                  </div>
                </div>
                <div className='progress-bar-container'>
                  <PostingProgressBar active={currStage} />
                </div>
              </div>
            </div>
          </CSSTransition>
    
          <CSSTransition
            in={currStage === 2}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="post-container">
              <div className='post-content-container'>
                <h2 className='post-content-header'>New Post</h2>
                <div className="input-container">
                  <label htmlFor="caption">Caption:</label>
                  <textarea id="caption" className="styled-input" placeholder="Write a caption..." value={postData.caption} onChange={(e) => setPostData(prev => ({ ...prev, caption: e.target.value}))}></textarea>

                  <label htmlFor="location">Location:</label>
                  <input id="location" className="styled-input" type="text" placeholder="Add location..." value={postData.location} onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value}))}/>

                  <label htmlFor="tagging">Tag Users:</label>
                  <input id="tagging" className="styled-input" type="text" placeholder="Tag users..." value={postData.mentions} onChange={(e) => setPostData(prev => ({ ...prev, mentions: e.target.value}))}/>

                  <label>
                    <input
                      type="checkbox"
                      checked={isFuturePost}
                      onChange={() => setIsFuturePost((prev) => !prev)}
                    />
                    Schedule for Future
                  </label>

                  {isFuturePost && (
                    <input
                      id="datetime"
                      className="styled-input"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) =>
                        setDateTime(e.target.value)
                      }
                    />)}
                </div>
              </div>
              <div className='post-bottom-container'>
                <div className='buttons-container'>
                    <div className='back-button-container'>
                      <BackButton show={currStage > 1} onClick={() => setCurrStage(prev => prev - 1)}/>
                    </div>
                    <div className='next-button-container-2'>
                      <NextButton show={postData.caption.length > 0} onClick={() => setCurrStage(prev => prev + 1)}/>
                    </div>
                  </div>
                <div className='progress-bar-container'>
                  <PostingProgressBar active={currStage} />
                </div>
              </div>
            </div>
          </CSSTransition>

          <CSSTransition
            in={currStage === 3}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="post-container">
              <div className='post-content-container'>
                <h2 className='post-content-header'>Select Platforms to Post To</h2>
                <div className="platform-options">
                  {platforms.map(({ name, icon }) => (
                    <div
                      key={name}
                      className={`platform-option ${selectedPlatforms.includes(name) ? 'selected' : ''}`}
                      onClick={() => togglePlatform(name)}
                    >
                      {icon}
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='post-bottom-container'>
                <div className='buttons-container'>
                    <div className='back-button-container'>
                      <BackButton show={currStage > 1} onClick={() => setCurrStage(prev => prev - 1)}/>
                    </div>
                    <div className='next-button-container-2'>
                      <NextButton show={selectedPlatforms.length > 0} onClick={() => {setCurrStage(prev => prev + 1);handlePost()}}/>
                    </div>
                  </div>
                <div className='progress-bar-container'>
                  <PostingProgressBar active={currStage} />
                </div>
              </div>
            </div>
          </CSSTransition>

          <CSSTransition
            in={currStage === 4}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="post-container">
              <Loading />
            </div>
          </CSSTransition>

          <CSSTransition
            in={currStage === 5}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <>
              {isFuturePost ? (
                <div className="post-container">
                  <div className="post-content-container">
                    <h2 className="post-content-header">Success! Your post has been scheduled.</h2>
                  </div>
                  <div className="post-bottom-container">
                    <div className="progress-bar-container">
                      <PostingProgressBar active={currStage - 1} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="post-container">
                  <div className="post-content-container">
                    <h2 className="post-content-header">Success! Here are the links:</h2>
                    <div className="platform-options-container">
                      {postLinks.map((post, index) => {
                        const platformName = Object.keys(post)[0];
                        const link = post[platformName];
                        if (!link) return null;

                        const platform = platforms.find((p) => p.name === platformName);

                        if (!platform) return null;

                        return (
                          <div
                            key={index}
                            className={`platform-option ${platform.name}`}
                            onClick={() => window.open(link, '_blank')}
                          >
                            <div className="platform-name-icon">
                              {platform.icon}
                              <span>{platform.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="post-bottom-container">
                    <div className="progress-bar-container">
                      <PostingProgressBar active={currStage - 1} />
                    </div>
                  </div>
                </div>
              )}
            </>
          </CSSTransition>
        </>
      );
    
}

export default Post