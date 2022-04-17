import { createNotifier } from '../utils.js';

const { notify, watch } = createNotifier();

let user = null;

export const watchUser = watch;

export const getUser = () => user;

export function setUser(u) {
  user = u;
  notify(user);
}
