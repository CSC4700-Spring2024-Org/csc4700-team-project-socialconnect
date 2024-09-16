import React, {useState} from 'react'
import DragNdrop from '../components/DragNDrop';
import '../Styles/Post.css'
import AWS from "aws-sdk"
import PostingProgressBar from '../components/PostingProgressBar';
import NextButton from '../components/NextButton';
import { CSSTransition } from 'react-transition-group'
import BackButton from '../components/BackButton';

const Post = () => {
    const [files, setFiles] = useState([]);
    const [currStage, setCurrStage] = useState(1)

    const uploadFile = async () => {
        // S3 Bucket Name
        const S3_BUCKET = "bucket-name";
    
        // S3 Region
        const REGION = "ohio";
    
        // S3 Credentials
        AWS.config.update({
          accessKeyId: "youraccesskeyhere",
          secretAccessKey: "yoursecretaccesskeyhere",
        });
        const s3 = new AWS.S3({
          params: { Bucket: S3_BUCKET },
          region: REGION,
        });
    
        // Files Parameters
    
        const params = {
          Bucket: S3_BUCKET,
          Key: files[0].name,
          Body: files,
        };
    
        // Uploading file to s3
    
        var upload = s3
          .putObject(params)
          .on("httpUploadProgress", (evt) => {
            // File uploading progress
            console.log(
              "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
            );
          })
          .promise();
    
        await upload.then((err, data) => {
          console.log(err);
          // Fille successfully uploaded
          alert("File uploaded successfully.");
        });
      };

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
              <div className="next-button-container">
                <NextButton show={files.length > 0} onClick={() => setCurrStage(prev => prev + 1)}/>
              </div>
              <PostingProgressBar active={currStage} />
            </div>
          </CSSTransition>
    
          <CSSTransition
            in={currStage !== 1}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="post-container-2">
              <h2>New Post</h2>
              <input className='caption-input' type='text'/>
              <BackButton show={currStage > 1} onClick={() => setCurrStage(prev => prev - 1)}/>
              <PostingProgressBar active={currStage} />
            </div>
          </CSSTransition>
        </>
      );
    
}

export default Post