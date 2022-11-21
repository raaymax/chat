import {createReducer, createAction} from '@reduxjs/toolkit';

const add = createAction('customEmojis/add');

const emojiReducer = createReducer([], {
  [add]: (emojis, action) => {
    const emoji = action.payload;
    const existing = emojis.find((e) => e.shortname === emoji.shortname);
    if (existing) {
      Object.assign(existing, emoji, {empty: false});
    } else {
      emojis.push(emoji);
    }
  },
  logout: () => ([]),
})

export const actions = {
  addEmoji: add,
}

export default emojiReducer;
