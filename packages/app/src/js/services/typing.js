import { client } from '../core';
import { actions, selectors } from '../state';

let cooldown = false;
let queue = false;

export const notifyTyping = () => (dispatch, getState) => {
  const config = selectors.getConfig(getState());
  const cid = selectors.getCid(getState());
  if (!config) return;
  if (cooldown) {
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  client.send({ type: 'typing', channel: cid });
  setTimeout(() => {
    cooldown = false;
    if (queue) {
      dispatch(notifyTyping());
    }
  }, 1000);
}

export const ackTyping = (msg) => (dispatch, getState) => {
  const meId = selectors.getMeId(getState());
  if (msg.userId === meId) return;
  dispatch(actions.addTyping(msg));
  setTimeout(() => dispatch(actions.clearTyping()), 1100);
}
