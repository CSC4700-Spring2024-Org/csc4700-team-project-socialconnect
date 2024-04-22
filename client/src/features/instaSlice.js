import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import instaService from './instaService'

const initialState = {
    instaPage: null,
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
          resolve(response.data);
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
            const instagramAccountId = await getInstagramAccountId(facebookPages[0].id, user);
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
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.message = ''
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getInstaProfile.pending, (state) => {
          state.isLoading = true
        })
        .addCase(getInstaProfile.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.instaPage = action.payload
        })
        .addCase(getInstaProfile.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
    },
  })
  
  export const { reset } = instaSlice.actions
  export default instaSlice.reducer