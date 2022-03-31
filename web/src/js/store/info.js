import { createNotifier } from '../utils.js';

const { notify, watch } = createNotifier();

let info = null;
let timeout = null;

export const watchInfo = watch;

export const getInfo = () => info;

export function setInfo(c, dur) {
  if (timeout) {
    clearTimeout(timeout);
  }
  info = c;
  notify(info);
  if (dur) {
    timeout = setTimeout(() => setInfo(null), dur);
  }
}
