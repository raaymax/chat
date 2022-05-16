import { client } from '../core';
import { getConfig } from '../store/config';
import { getCid } from '../store/channel';

import { getUser } from '../store/user';
import { setInfo } from '../store/info';

let cooldown = false;
let queue = false;

export function notifyTyping() {
  if (!client.active) return;
  if (!getConfig) return;
  if (cooldown) {
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  client.send({ op: { type: 'typing', channel: getCid() } });
  setTimeout(() => {
    cooldown = false;
    if (queue) {
      notifyTyping();
    }
  }, 1000);
}

export function ackTyping(_, msg) {
  if (msg.op.channel !== getCid()) return;
  if (msg.user.id === getUser().id) return;
  setInfo({ msg: `${msg.user.name} is typing`, type: 'info' }, 1000);
}
