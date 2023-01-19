import {createReducer, createAction} from '@reduxjs/toolkit';

const set = createAction('stream/set');
const patch = createAction('stream/patch');

const INIT = () => ({main: {}, side: null});
const reducer = createReducer(INIT(), {
  [set]: (state, action) => {
    const {id, value} = action.payload;
    if (value) {
      state[id] = {id, ...value};
    } else {
      state[id] = value;
    }
  },
  [patch]: (state, action) => {
    const {id, patch = {}} = action.payload;
    state[id] = {...state[id], ...patch};
  },
  logout: INIT,
})

export const actions = {
  setStream: set,
  patchStream: patch,
};

export default reducer;
