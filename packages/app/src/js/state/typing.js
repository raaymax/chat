import {createReducer, createAction} from '@reduxjs/toolkit';

const add = createAction('typing/add');
const clear = createAction('typing/clear');

const reducer = createReducer({}, {
  [add]: (state, action) => {
    state[action.payload.channel] = state[action.payload.channel] || {};
    state[action.payload.channel][action.payload.userId] = new Date().toISOString();
  },
  [clear]: (state) => Object.fromEntries(
    Object.entries(state)
      .map(([channel, users]) => [
        channel,
        Object.fromEntries(
          Object.entries(users)
            .filter(([, date]) => new Date(date) > new Date(Date.now() - 1000)),
        ),
      ]),
  ),
  logout: () => ({ }),
})

export const actions = {
  addTyping: add,
  clearTyping: clear,
};

export default reducer;
