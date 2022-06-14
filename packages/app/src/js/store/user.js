import { createNotifier } from '../utils.js';

const [notify, watch] = createNotifier();

let userId = null;

export const watchUserId = watch;

export const getUserId = () => userId;
export const isMe = (id) => userId === id;

export function setUserId(u) {
  userId = u;
  notify(userId);
}
