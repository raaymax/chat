import {createReducer, createAction} from '@reduxjs/toolkit';

const add = createAction('customEmojis/add');

const emojiReducer = createReducer([], {
  [add]: (emojis, action) => {
    emojis.push(action.payload);
  },
  logout: () => ([]),
})

export const actions = {
  addEmoji: add,
}

export default emojiReducer;
