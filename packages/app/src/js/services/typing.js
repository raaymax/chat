import { client } from '../core';

let cooldown = false;
let queue = false;

export const notifyTyping = ({channelId, parentId}) => (dispatch) => {
  if (cooldown) {
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  client.send({ type: 'typing:send', channelId, parentId });
  setTimeout(() => {
    cooldown = false;
    if (queue) {
      dispatch(notifyTyping({channelId, parentId}));
    }
  }, 1000);
};
