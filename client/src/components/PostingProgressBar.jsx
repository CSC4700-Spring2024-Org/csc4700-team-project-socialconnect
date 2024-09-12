import React from 'react'
import '../Styles/ProgressBar.css'

const PostingProgressBar = ({active}) => {
  return (
    <div className='progress-bar'>
        <div class="stepper-wrapper">
            <div class={`stepper-item ${active > 1 ? 'completed' : ''} ${active == 1 ? 'active' : ''}`}>
                <div class="step-counter">1</div>
                <div class="step-name">Upload</div>
            </div>
            <div class={`stepper-item ${active > 2 ? 'completed' : ''} ${active == 2 ? 'active' : ''}`}>
                <div class="step-counter">2</div>
                <div class="step-name">Second</div>
            </div>
            <div class={`stepper-item ${active > 3 ? 'completed' : ''} ${active == 3 ? 'active' : ''}`}>
                <div class="step-counter">3</div>
                <div class="step-name">Third</div>
            </div>
            <div class={`stepper-item ${active == 4 ? 'active' : ''}`}>
                <div class="step-counter">4</div>
                <div class="step-name">Forth</div>
            </div>
        </div>
    </div>
  )
}

export default PostingProgressBar