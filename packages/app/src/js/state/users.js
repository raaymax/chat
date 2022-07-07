import {
  createReducer, createAction, createAsyncThunk, createSelector,
} from '@reduxjs/toolkit';
import {client} from '../core';

const addUser = createAction('users/add');

const setMe = createAction('users/me/set');

const usersReducer = createReducer({list: [], meId: null}, {
  [addUser]: ({list}, action) => {
    const msg = action.payload;
    const existing = list.find((m) => m.id === msg.id);
    if (existing) {
      Object.assign(existing, msg);
    }
    list.push(msg);
  },
  [setMe]: (state, action) => {
    state.meId = action.payload;
  },
  logout: () => ({ list: [], meId: null }),
});

const loadUsers = createAsyncThunk('users/load', async (args, api) => client.req({type: 'users'}))

export const actions = {
  setMe,
  addUser,
  loadUsers,
}

export default usersReducer;
