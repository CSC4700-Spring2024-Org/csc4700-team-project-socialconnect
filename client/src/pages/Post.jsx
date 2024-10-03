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

const Post = () => {
    const [files, setFiles] = useState([]);
    const [currStage, setCurrStage] = useState(1)
    const [postData, setPostData] = useState({caption:'',location:'',mentions:''})
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [postLinks, setPostLinks] = useState([])

    const { user, isError, isSuccess, isLoading } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const platforms = [
      { name: 'Instagram', icon: <FaInstagram /> },
      { name: 'TikTok', icon: <FaTiktok /> },
      { name: 'X', icon: <FaTwitter /> },
      { name: 'YouTube', icon: <FaYoutube /> }
    ];

    const togglePlatform = (platform) => {
      setSelectedPlatforms((prev) =>
        prev.includes(platform)
          ? prev.filter((p) => p !== platform)
          : [...prev, platform]
      );
    };

    const handlePost = async () => {
      if (selectedPlatforms.includes('Instagram')) {        
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('post', new Blob([JSON.stringify({urls: files.map(file => `https://posts.danbfrost.com/${file.name}`), caption: postData.caption, location: postData.location, taggedUsers: postData.mentions.split(',')})], { type: 'application/json' }));

        const res = await instaService.createInstagramPost(user.instaRefresh, formData)

        if (res.data.error) {
          toast(res.data.error)
        } else {
          setPostLinks(prev => [...prev, res.data])
          setCurrStage(prev => prev + 1)
        }
      }
    }

      useEffect(() => {
        if (!isLoading) {
          if (isSuccess && user) {
            navigate('/post');
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
              <h2>Upload Content Here</h2>
              <DragNdrop onFilesSelected={setFiles} width="50%" height="50%" />
              <div className='buttons-container'>
                <div className="next-button-container">
                  <NextButton show={files.length > 0} onClick={() => setCurrStage(prev => prev + 1)}/>
                </div>
              </div>
              <PostingProgressBar active={currStage} />
            </div>
          </CSSTransition>
    
          <CSSTransition
            in={currStage === 2}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="post-container">
              <h2 className='new-post-header'>New Post</h2>
              <div className="input-container">
                <label htmlFor="caption">Caption:</label>
                <textarea id="caption" className="styled-input" placeholder="Write a caption..." value={postData.caption} onChange={(e) => setPostData(prev => ({ ...prev, caption: e.target.value}))}></textarea>

                <label htmlFor="location">Location:</label>
                <input id="location" className="styled-input" type="text" placeholder="Add location..." value={postData.location} onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value}))}/>

                <label htmlFor="tagging">Tag Users:</label>
                <input id="tagging" className="styled-input" type="text" placeholder="Tag users..." value={postData.mentions} onChange={(e) => setPostData(prev => ({ ...prev, mentions: e.target.value}))}/>
              </div>
              <div className='buttons-container'>
                <div className='back-button-container'>
                  <BackButton show={currStage > 1} onClick={() => setCurrStage(prev => prev - 1)}/>
                </div>
                <div className='next-button-container-2'>
                  <NextButton show={postData.caption.length > 0} onClick={() => setCurrStage(prev => prev + 1)}/>
                </div>
              </div>
              <PostingProgressBar active={currStage} />
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
                <h2>Select Platforms to Post To</h2>
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
              <div className='buttons-container'>
                <div className='back-button-container'>
                  <BackButton show={currStage > 1} onClick={() => setCurrStage(prev => prev - 1)}/>
                </div>
                <div className='next-button-container-2'>
                  <NextButton show={selectedPlatforms.length > 0} onClick={() => {setCurrStage(prev => prev + 1);handlePost()}}/>
                </div>
              </div>
              <PostingProgressBar active={currStage} />
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
            <div className="post-container">
              <h2>Success! Here are the links:</h2>
              {postLinks.map((post) => {
                return (
                  <a className='post-link' href={post}>
                    Instagram
                  </a>
                )
              })}
              <PostingProgressBar active={currStage} />
            </div>
          </CSSTransition>
        </>
      );
    
}

export default Post