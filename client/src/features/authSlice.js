import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user)
        } catch (error) {
            const message = error.response.status
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
      const message = error.response.data
      return thunkAPI.rejectWithValue(message)
    }
})

export const getUser = createAsyncThunk('auth/getUser', async (thunkAPI) => {
    try {
        return await authService.getUser();
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async (thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const setInstagram = createAsyncThunk(
  'auth/setInstagram',
  async (instaToken, thunkAPI) => {
      try {
          return await authService.setInstagram(instaToken)
      } catch (error) {
          const message = (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
          return thunkAPI.rejectWithValue(message)
      }
  }
)

export const tiktokLogout = createAsyncThunk(
  'auth/tiktokLogout',
  async (thunkAPI) => {
    try {
        const res = await authService.tiktokLogout()
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

export const youtubeLogout = createAsyncThunk(
  'auth/youtubeLogout',
  async (thunkAPI) => {
    try {
        const res = await authService.youtubeLogout()
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

export const removePostStatusMessage = createAsyncThunk(
  'auth/removeMessage',
  async (thunkAPI) => {
    try {
        const res = await authService.removePostStatusMessage()
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

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.message = ''
      },
      updateUser: (state, action) => {
        state.user = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          if (action.payload === 400) {
            state.message = "Username taken!"
          }
          state.user = null
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.user = null
        })
        .addCase(getUser.pending, (state) => {
          state.isLoading = true
        })
        .addCase(getUser.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload

        })
        .addCase(getUser.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
        .addCase(logout.fulfilled, (state) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = null
        })
        .addCase(logout.pending, (state) => {
          state.isLoading = true
        })
        .addCase(setInstagram.fulfilled, (state, action) => {
          state.user.instaRefresh = action.payload
        })
        .addCase(tiktokLogout.pending, (state) => {
          state.isLoading = true
        })
        .addCase(tiktokLogout.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload

        })
        .addCase(tiktokLogout.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
        .addCase(youtubeLogout.pending, (state) => {
          state.isLoading = true
        })
        .addCase(youtubeLogout.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload

        })
        .addCase(youtubeLogout.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
        .addCase(removePostStatusMessage.fulfilled, (state) => {
          state.isLoading = false
          state.isSuccess = true
          let tempUser = state.user
          tempUser.postStatusMessage = null
          state.user = tempUser
        })
        .addCase(removePostStatusMessage.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
    },
  })
  
  export const { reset, updateUser } = authSlice.actions
  export default authSlice.reducer