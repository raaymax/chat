import client from '../client';
import { getConfig } from '../store/config';

let cooldown = false;
let queue = false;
export function notifyTyping() {
  if (!getConfig) return;
  if (cooldown) {
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  client.send({ op: { type: 'typing' } });
  setTimeout(() => {
    cooldown = false;
    if (queue) {
      notifyTyping();
    }
  }, 1000);
}
