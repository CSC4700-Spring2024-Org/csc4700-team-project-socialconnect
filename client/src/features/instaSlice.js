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

const getFacebookPages = (user) => {
    return new Promise((resolve) => {
      window.FB.api(
        "me/accounts",
        { access_token: user.instaRefresh },
        (response) => {
          resolve(response);
        }
      );
    });
  };

  const getInstagramAccountId = (facebookPageId, user) => {
    return new Promise((resolve) => {
      window.FB.api(
        facebookPageId,
        {
          access_token: user.instaRefresh,
          fields: "instagram_business_account",
        },
        (response) => {
          resolve(response.instagram_business_account.id);
        }
      );
    });
  };

export const getInstaProfile = createAsyncThunk(
    'insta/profile',
    async (user, thunkAPI) => {
        try {
            const facebookPages = await getFacebookPages(user);
            if (facebookPages.error && facebookPages.error.code === 190) {
              thunkAPI.dispatch(setInstagram("None"))
              return thunkAPI.rejectWithValue("Instagram token has expired, please log in again")
            }
            const instagramAccountId = await getInstagramAccountId(facebookPages.data[0].id, user);
            return await instaService.getInstaProfile(instagramAccountId, user.instaRefresh)
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