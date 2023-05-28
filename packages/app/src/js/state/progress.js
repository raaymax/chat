import { createReducer, createAction } from '@reduxjs/toolkit';

const add = createAction('progress/add');

const progressReducer = createReducer([], {
  [add]: (state, action) => {
    const { payload } = action;
    const found = state.find((item) => item.channelId === payload.channelId
      && item.userId === payload.userId && item.parentId === payload.parentId);
    if (found) {
      Object.assign(found, payload);
    } else {
      state.push(payload);
    }
  },
  logout: () => ([]),
});

export const actions = {
  addProgress: add,
};

export default progressReducer;
