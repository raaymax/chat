import {createReducer, createAction} from '@reduxjs/toolkit';

const add = createAction('typing/add');
const clear = createAction('typing/clear');

const reducer = createReducer({}, {
  [add]: (state, action) => {
    const { userId, channelId } = action.payload;
    state[channelId] = state[channelId] || {};
    state[channelId][userId] = new Date().toISOString();
  },
  [clear]: (state) => Object.fromEntries(
    Object.entries(state)
      .map(([channelId, users]) => [
        channelId,
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
