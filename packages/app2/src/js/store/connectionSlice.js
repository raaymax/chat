import { createSlice } from '@reduxjs/toolkit'

export const connectionSlice = createSlice({
  name: 'users',
  initialState: {
    sanityCheck: 0,
    isActive: false,
  },
  reducers: {
    connected: (state) => {
      state.sanityCheck += 1;
      state.isActive = true;
    },
    disconnected: (state) => {
      state.sanityCheck -= 1;
      state.isActive = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const { connected, disconnected } = connectionSlice.actions

export default connectionSlice.reducer
