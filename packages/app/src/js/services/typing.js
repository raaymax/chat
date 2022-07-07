import { client } from '../core';
import {actions} from '../state';

let cooldown = false;
let queue = false;

export const notifyTyping = () => (dispatch, getState) => {
  const {config, channels} = getState();
  if (!config) return;
  if (cooldown) {
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  client.send({ type: 'typing', channel: channels.current });
  setTimeout(() => {
    cooldown = false;
    if (queue) {
      dispatch(notifyTyping());
    }
  }, 1000);
}

export const ackTyping = (msg) => (dispatch, getState) => {
  const {meId} = getState().users;
  if (msg.userId === meId) return;
  dispatch(actions.addTyping(msg));
  setTimeout(() => dispatch(actions.clearTyping()), 1100);
}
