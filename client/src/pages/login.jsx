import React, {useState, useEffect} from 'react'
import '../Styles/login.css'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { login, reset, register, getUser } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'
import { FaCircle, FaCheck } from 'react-icons/fa';

const Login = () => {
   const [slide, setSlide] = useState(false)
   const [formData, setFormData] = useState({
      username: '',
      password: '',
      email: ''
   })

   const { username, password, email } = formData
   const userAgent = navigator.userAgent

   const [requirements, setRequirements] = useState({
      length: false,
      number: false,
      lowercase: false,
      uppercase: false,
      special: false,
    });

    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

    const validateRequirements = (value) => {
      setRequirements({
        length: value.length >= 8,
        number: /\d/.test(value),
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        special: /[!@#$%^&*]/.test(value),
      });
    };

   const navigate = useNavigate()
   const dispatch = useDispatch()

   const { user, isLoading, isError, isSuccess, message } = useSelector(
      (state) => state.auth
   )

   const [initialRenderCompleted, setInitialRenderCompleted] = useState(false);

   useEffect(() => {
     if (!user) {
       dispatch(getUser()).finally(() => {
         setInitialRenderCompleted(true);
       });
     } else {
       setInitialRenderCompleted(true);
     }
   }, []);
 
   useEffect(() => {
      if (isError && message) {
         toast.error(message)
      }

      if (initialRenderCompleted && !isLoading) {
         if (isSuccess && user) {
            navigate('/');
         }
      }
   }, [user, isSuccess, isError, navigate, isLoading, initialRenderCompleted]);

   const onChange = (e) => {
      setFormData((prevState) => ({
         ...prevState,
         [e.target.name]: e.target.value,
      }))
   }

   const onLoginSubmit = (e) => {
      e.preventDefault()

      const userData = {
         username,
         password,
         userAgent
      }

      dispatch(login(userData))
   }

   const onRegisterSubmit = (e) => {
      e.preventDefault()

      const userData = {
         username,
         password,
         userAgent,
         email
      }
      
      dispatch(register(userData))
   }

   return (
      <>
         {!isLoading ? <div className={`outer ${slide === true ? "slide" : ""}`}>
            <div className="container">
               <div className="boxC signin">
                  <h2>Already Have An Account?</h2>
                  <button className="signinBtn" onClick={() => setSlide(!slide)}>Sign in</button>
               </div>
               <div className="boxC signup">
                  <h2>Don't Have An Account?</h2>
                  <button className="SignupBtn" onClick={() => setSlide(!slide)}>Sign up</button>
               </div>
               <div className="formBx">
                  <div className="form signinform">
                     <form onSubmit={onLoginSubmit}>
                        <h3>Sign In</h3>
                        <input type="text" placeholder='Username' name='username' value={username} onChange={onChange}/>
                        <input type="password" placeholder="Password" name='password' value={password} onChange={onChange}/>
                        <input type="submit" value="Login"/>
                     </form>
                  </div>
                  <div className="form signupform">
                     <form onSubmit={onRegisterSubmit}>
                        <h3>Sign Up</h3>
                        <input type="text" placeholder= 'Email' name='email' value={email} onChange={onChange}/>
                        <input type="text" placeholder='Username' name='username' value={username} onChange={onChange}/>
                        <input type="password" placeholder="Password" name='password' value={password} onChange={onChange} onKeyUp={(e) => validateRequirements(e.target.value)} onFocus={() => setShowPasswordRequirements(true)} onBlur={() => setShowPasswordRequirements(false)}/>
                         {showPasswordRequirements ? <div className={`password-content ${showPasswordRequirements ? 'show':''}`}>
                           <p className='password-requirements-header'>Password must contain:</p>
                           <ul className="requirements-list">
                              <li>
                                 {requirements.length ? <FaCheck className='check' /> : <FaCircle className='circle' />}
                                 <span>At least 8 characters length</span>
                              </li>
                              <li>
                                 {requirements.number ? <FaCheck className='check' /> : <FaCircle className='circle' />}
                                 <span>At least 1 number</span>
                              </li>
                              <li>
                                 {requirements.lowercase ? <FaCheck className='check' /> : <FaCircle className='circle' />}
                                 <span>At least 1 lowercase letter</span>
                              </li>
                              <li>
                                 {requirements.uppercase ? <FaCheck className='check' /> : <FaCircle className='circle' />}
                                 <span>At least 1 uppercase letter</span>
                              </li>
                              <li>
                                 {requirements.special ? <FaCheck className='check' /> : <FaCircle className='circle' />}
                                 <span>At least 1 special character</span>
                              </li>
                           </ul>
                        </div> : <></>}
                        <input type="submit" value="Register"/>
                     </form>
                  </div>
               </div>
            </div>
         </div> : <></>}
      </>
  )
}

export default Login