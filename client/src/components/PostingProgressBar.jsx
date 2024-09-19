import React from 'react'
import '../Styles/ProgressBar.css'

const PostingProgressBar = ({active}) => {
  return (
    <div className='progress-bar'>
        <div className="stepper-wrapper">
            <div className={`stepper-item ${active > 1 ? 'completed' : ''} ${active == 1 ? 'active' : ''}`}>
                <div className="step-counter">1</div>
                <div className="step-name">Upload</div>
            </div>
            <div className={`stepper-item ${active > 2 ? 'completed' : ''} ${active == 2 ? 'active' : ''}`}>
                <div className="step-counter">2</div>
                <div className="step-name">Create Post</div>
            </div>
            <div className={`stepper-item ${active > 3 ? 'completed' : ''} ${active == 3 ? 'active' : ''}`}>
                <div className="step-counter">3</div>
                <div className="step-name">Select Platforms</div>
            </div>
            <div className={`stepper-item ${active == 4 ? 'active' : ''}`}>
                <div className="step-counter">4</div>
                <div className="step-name">Done</div>
            </div>
        </div>
    </div>
  )
}

export default PostingProgressBar