import { createReducer, createAction } from '@reduxjs/toolkit';

const set = createAction('stream/set');
const setMain = createAction('stream/setMain');
const patch = createAction('stream/patch');

const INIT = () => ({ main: {}, side: null, mainChannelId: null });
const reducer = createReducer(INIT(), {
  [set]: (state, action) => {
    const { id, value } = action.payload;
    if (value) {
      state[id] = { id, ...value };
    } else {
      state[id] = value;
    }
  },
  [patch]: (state, action) => {
    const { id, patch = {} } = action.payload;
    state[id] = { ...state[id], ...patch };
  },
  [setMain]: (state, action) => {
    const id = action.payload;
    state.mainChannelId = id;
  },
  logout: INIT,
});

export const actions = {
  setStream: set,
  patchStream: patch,
  setMainChannel: setMain,
};

export default reducer;
