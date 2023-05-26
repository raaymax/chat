import {
  createReducer, createAction,
} from '@reduxjs/toolkit';

const addUser = createAction('users/add');

const setMe = createAction('users/me/set');

const usersReducer = createReducer({ list: [], meId: null }, {
  [addUser]: ({ list }, action) => {
    [action.payload].flat().forEach((msg) => {
      const existing = list.find((m) => m.id === msg.id);
      if (existing) {
        Object.assign(existing, msg);
      }
      list.push(msg);
    });
  },
  [setMe]: (state, action) => {
    state.meId = action.payload;
  },
  logout: () => ({ list: [], meId: null }),
});

export const actions = {
  setMe,
  addUser,
};

export default usersReducer;
