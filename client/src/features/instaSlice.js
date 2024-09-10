import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import instaService from './instaService'
import { setInstagram } from './authSlice';

const initialState = {
    instaPage: null,
    comments: null,
    isErrorInsta: false,
    isSuccessInsta: false,
    isLoadingInsta: false,
    message: '',
}

export const getInstaProfile = createAsyncThunk(
    'insta/profile',
    async (user, thunkAPI) => {
        try {
            // const facebookPages = await getFacebookPages(user);
            // if (facebookPages.error && facebookPages.error.code === 190) {
            //   thunkAPI.dispatch(setInstagram("None"))
            //   return thunkAPI.rejectWithValue("Instagram token has expired, please log in again")
            // }
            // const instagramAccountId = await getInstagramAccountId(facebookPages.data[0].id, user);
            const res = await instaService.getInstaProfile(user.instaRefresh)
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
          state.isLoadingInsta = false
          state.isSuccessInsta = true
          state.instaPage = action.payload.page
          state.comments = action.payload.comments
        })
        .addCase(getInstaProfile.rejected, (state, action) => {
          state.isLoadingInsta = false
          state.isErrorInsta = true
          state.message = action.payload
        })
    },
  })
  
  export const { reset } = instaSlice.actions
  export default instaSlice.reducer