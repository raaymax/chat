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

export const ackTyping = (msg) => (dispatch, getState) => {
  const meId = getState().me;
  if (msg.userId === meId) return;
  dispatch.actions.typing.add(msg);
  setTimeout(() => dispatch.actions.typing.clear(), 1100);
};
