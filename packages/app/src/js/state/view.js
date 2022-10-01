import {
  createReducer, createAction,
} from '@reduxjs/toolkit';

const setView = createAction('view/set');

const viewReducer = createReducer({current: null}, {
  [setView]: (state, action) => {
    const view = action.payload;
    if (state.current === view) {
      state.current = null;
    } else {
      state.current = view;
    }
  },
  logout: () => ({ current: null}),
});

export const actions = {
  setView,
}

export default viewReducer;
