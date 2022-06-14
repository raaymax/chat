import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
  },
  reducers: {
    user: (state, action) => {
      const user = state.users.find((u) => u.id === action.id);
      if (user) {
        Object.assign(user, {
          name: action.name,
          avatarUrl: action.avatarUrl,
        });
      } else {
        state.users = [...state.users, {
          id: action.id,
          name: action.name,
          avatarUrl: action.avatarUrl,
        }]
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { user } = usersSlice.actions

export default usersSlice.reducer
