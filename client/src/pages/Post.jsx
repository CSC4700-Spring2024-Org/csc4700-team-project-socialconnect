import React, {useState} from 'react'
import DragNdrop from '../components/DragNDrop';
import '../Styles/Post.css'
import AWS from "aws-sdk"
import PostingProgressBar from '../components/PostingProgressBar';

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
        <div className='post-container'>
            <h1>Image</h1>
            <DragNdrop onFilesSelected={setFiles} width='50%' height='50%'/>
            <PostingProgressBar active={currStage} />
        </div>
    )
}

export default Post