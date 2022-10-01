import {createReducer, createAction} from '@reduxjs/toolkit';

const initFailed = createAction('system/init/failed');

const reducer = createReducer({initFailed: false}, {
  [initFailed]: (state, action) => {
    state.initFailed = action.payload;
  },
  logout: () => ({ initFailed: false }),
})

export const actions = {
  initFailed,
};

export default reducer;
