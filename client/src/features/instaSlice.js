import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import instaService from './instaService'
import { setInstagram } from './authSlice';

const initialState = {
    instaPage: null,
    tiktokPage: null,
    comments: null,
    insights: null,
    isErrorInsta: false,
    isSuccessInsta: false,
    isLoadingInsta: false,
    instaCommentsLoading: false,
    message: '',
}

export const getInstaProfile = createAsyncThunk(
    'insta/profile',
    async (user, thunkAPI) => {
        try {
<<<<<<< HEAD
            const res = await instaService.getInstaProfile()
=======
            const res = await instaService.getInstaProfile(user.instaRefresh)
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
            if (res.error) {
              if (res.code === 190) {
                thunkAPI.dispatch(setInstagram("None"))
                return thunkAPI.rejectWithValue("Instagram token has expired, please log in again")
              }
              return thunkAPI.rejectWithValue(res.error)
            }
            return res;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.message.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const replyInstagram = createAsyncThunk(
    'insta/replyComment',
    async (replyData, thunkAPI) => {
      try {
<<<<<<< HEAD
          const res = await instaService.replyInstagram(replyData.replyData)
=======
          const res = await instaService.replyInstagram(replyData.user.instaRefresh, replyData.replyData)
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
          if (res.error) {
            return thunkAPI.rejectWithValue(res.error)
          }
          return res;
      } catch (error) {
          const message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.message.toString()
          return thunkAPI.rejectWithValue(message)
      }
  }
)

export const instaSlice = createSlice({
    name: 'insta',
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoadingInsta = false
        state.isSuccessInsta = false
        state.isErrorInsta = false
        state.message = ''
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getInstaProfile.pending, (state) => {
          state.isLoadingInsta = true
        })
        .addCase(getInstaProfile.fulfilled, (state, action) => {
          state.isSuccessInsta = true
          state.instaPage = action.payload.instaPage
          state.tiktokPage = action.payload.tiktokPage
          state.comments = action.payload.comments
<<<<<<< HEAD
          state.insights = action.payload.insights
=======
>>>>>>> 60bb0cfde84bbe347365fb943adc491fe1482467
          state.isLoadingInsta = false
        })
        .addCase(getInstaProfile.rejected, (state, action) => {
          state.isErrorInsta = true
          state.message = action.payload
          state.isLoadingInsta = false
        })
        .addCase(replyInstagram.pending, (state) => {
          state.instaCommentsLoading = true
        })
        .addCase(replyInstagram.fulfilled, (state, action) => {
          state.isSuccessInsta = true
          let tempComments = state.comments
          for (let i = 0; i < tempComments.length; i++) {
            if (tempComments[i].id === action.payload.oldID) {
              tempComments[i].replies !== null ? tempComments[i].replies.data.push(action.payload.newComment) : tempComments[i].replies = {data:[action.payload.newComment]}
            }
            if (tempComments[i].replies) {
              for (let j = 0; j < tempComments[i].replies.data.length; j++) {
                if (tempComments[i].replies.data[j].id === action.payload.oldID) {
                  tempComments[i].replies.data.splice(j+1, 0, action.payload.newComment)
                }
              }
            }
          }
          state.comments = tempComments
          state.instaCommentsLoading = false
        })
        .addCase(replyInstagram.rejected, (state, action) => {
          state.isErrorInsta = true
          state.message = action.payload
          state.isLoadingInsta = false
        })
    },
  })
  
  export const { reset } = instaSlice.actions
  export default instaSlice.reducer