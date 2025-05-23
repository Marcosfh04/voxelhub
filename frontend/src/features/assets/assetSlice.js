import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import assetService from './assetService'

// Estado inicial
const initialState = {
  assets: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Obtener assets
export const getAssets = createAsyncThunk('assets/getAll', async (_, thunkAPI) => {
  try {
    return await assetService.getAssets()
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Crear asset
export const createAsset = createAsyncThunk('assets/create', async (assetData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await assetService.createAsset(assetData, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Borrar asset
export const deleteAsset = createAsyncThunk('assets/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await assetService.deleteAsset(id, token)
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAssets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.assets = action.payload
      })
      .addCase(getAssets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.assets.push(action.payload)
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter((a) => a._id !== action.payload.id)
      })
  },
})

export const { reset } = assetSlice.actions
export default assetSlice.reducer
