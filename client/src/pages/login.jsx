import React, {useState, useEffect} from 'react'
import '../Styles/login.css'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { login, reset, register } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {
   const [slide, setSlide] = useState(false)
   const [formData, setFormData] = useState({
      username: '',
      password: '',
   })

   const { username, password } = formData

   const navigate = useNavigate()
   const dispatch = useDispatch()

   const { user, isLoading, isError, isSuccess, message } = useSelector(
      (state) => state.auth
   )

   useEffect(() => {
      if (isError) {
         toast.error(message)
      }

      if ((isSuccess || user) && !isLoading) {
         navigate('/')
      }

      dispatch(reset())
   }, [user, isError, isSuccess, message, navigate, dispatch])

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
      }

      dispatch(login(userData))
   }

   const onRegisterSubmit = (e) => {
      e.preventDefault()

      const userData = {
         username,
         password
      }
      
      dispatch(register(userData))
   }

   return (
      <div className={`outer ${slide === true ? "slide" : ""}`}>
         <div class="container">
            <div class="boxC signin">
               <h2>Already Have An Account?</h2>
               <button class="signinBtn" onClick={() => setSlide(!slide)}>Sign in</button>
            </div>
            <div class="boxC signup">
               <h2>Don't Have An Account?</h2>
               <button class="SignupBtn" onClick={() => setSlide(!slide)}>Sign up</button>
            </div>
            <div class="formBx">
               <div class="form signinform">
                  <form onSubmit={onLoginSubmit}>
                     <h3>Sign In</h3>
                     <input type="text" placeholder='Username' name='username' value={username} onChange={onChange}/>
                     <input type="password" placeholder="Password" name='password' value={password} onChange={onChange}/>
                     <input type="submit" value="Login"/>
                  </form>
               </div>
               <div class="form signupform">
                  <form onSubmit={onRegisterSubmit}>
                     <h3>Sign Up</h3>
                     <input type="text" placeholder='Username' name='username' value={username} onChange={onChange}/>
                     <input type="password" placeholder="Password" name='password' value={password} onChange={onChange}/>
                     <input type="submit" value="Register"/>
                  </form>
               </div>
            </div>
         </div>
      </div>
  )
}

export default Login