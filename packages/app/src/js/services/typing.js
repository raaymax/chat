import { client } from '../core';
import { getConfig } from '../store/config';
import { getCid } from '../store/channel';

import { getUserId } from '../store/user';
import { getUser } from '../store/users';
import { setInfo } from '../store/info';

let cooldown = false;
let queue = false;

export function notifyTyping() {
  if (!getConfig()) return;
  if (cooldown) {
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  client.send({ type: 'typing', channel: getCid() });
  setTimeout(() => {
    cooldown = false;
    if (queue) {
      notifyTyping();
    }
  }, 1000);
}

export function ackTyping(_, msg) {
  if (msg.channel !== getCid()) return;
  if (msg.userId === getUserId()) return;
  setInfo({ msg: `${getUser(msg.userId)?.name || 'Someone'} is typing`, type: 'info' }, 1000);
}
