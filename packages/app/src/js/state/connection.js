import { createReducer, createAction } from '@reduxjs/toolkit';

const connected = createAction('connection/open');
const disconnected = createAction('connection/close');

const connectionReducer = createReducer(false, {
  [connected]: () => true,
  [disconnected]: () => false,
});

export const actions = {
  connected,
  disconnected,
};

export default connectionReducer;
