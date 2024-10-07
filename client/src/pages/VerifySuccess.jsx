import React from 'react';
import '../Styles/VerifySuccess.css'

const VerifySuccess = () => {
  return (
      <div className='verify-success-container'>
        <h3 className='success-header'>Congratulations, your account has been verified.</h3>
        <h4 className='h4verify'>
          <a href="/login">Click here to Login</a>
        </h4>
      </div>
  );
};

export default VerifySuccess;