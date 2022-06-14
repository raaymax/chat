import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersReducer';
import connectionSlice from './connectionSlice';

export default configureStore({
  reducer: {
    user: usersReducer,
    connection: connectionSlice,
  },
})
