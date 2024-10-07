import React from 'react'
import '../Styles/CreatedAccount.css'
const CreatedAccount = () => {
  return (
    <div className='created-account-container'>
      <h3 className='success-header'>You have signed up successfully!</h3>
      <p className='success-header'>Please check your email to verify your account.</p>     
     <h4 className='h4verify'><a href="/login">Click here to Login</a></h4>
    </div>
  )
}

export default CreatedAccount
