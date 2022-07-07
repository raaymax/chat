import {createReducer, createAction} from '@reduxjs/toolkit';

const show = createAction('info/show');
const clear = createAction('info/clear');

const reducer = createReducer({type: null, message: ''}, {
  [show]: (state, action) => {
    state.type = action.payload.type;
    state.message = action.payload.message;
  },
  [clear]: (state) => {
    state.type = null;
    state.message = '';
  },
  logout: () => ({ type: null, message: ''}),
})

export const actions = {
  showInfo: show,
  clearInfo: clear,
};

export default reducer;
