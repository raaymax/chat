import {createReducer, createAction} from '@reduxjs/toolkit';

const set = createAction('stream/set');

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
  logout: INIT,
})

export const actions = {
  setStream: set,
};

export default reducer;
