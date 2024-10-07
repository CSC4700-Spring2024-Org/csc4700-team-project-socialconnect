import React from 'react'
import '../Styles/VerifyFailed.css'

const VerifyFailed = () => {
  return (
    <div className='verify-failed-container'>
    <h4 className='failed-header'>Sorry, we could not verify account. 
    </h4>
    <h4 className='failed-header'> It may already be verified,or the verification code is incorrect.
    </h4>
    <h4 className='h4verify'>
          <a href="/login">Back to Signup</a>
    </h4>
    </div>
  )
}

export default VerifyFailed