import {createReducer, createAction} from '@reduxjs/toolkit';

const setAppVersion = createAction('app-version/set');

const configReducer = createReducer(null, {
  [setAppVersion]: (state, action) => {
    state = state || {};
    state.appVersion = action.payload;
    return state;
  },
  logout: () => null,
})

export const actions = {
  setAppVersion,
};

export default configReducer;
