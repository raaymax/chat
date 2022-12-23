import {
  createReducer, createAction,
} from '@reduxjs/toolkit';

const setThread = createAction('thread/set');

const reducer = createReducer({stream: null}, {
  [setThread]: (state, action) => {
    state.stream = action.payload;
  },
  logout: () => ({stream: null}),
});

export const actions = {
  setThread,
}

export default reducer;
