import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import instaReducer from '../features/instaSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    insta: instaReducer
  },
})