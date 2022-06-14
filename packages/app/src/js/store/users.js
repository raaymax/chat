import { createNotifier } from '../utils.js';
import {getUserId} from './user';

const [notify, watch] = createNotifier();

let list = [];

export const getMe = () => getUser(getUserId());

export const getUser = (id) => list.find((m) => m.id === id);

export const getUsers = () => list;

export const insertUser = (msg) => {
  const existing = getUser(msg.id);
  if (existing) {
    Object.assign(existing, msg);
    return notify(list);
  }
  list = [
    ...list,
    msg,
  ];
  notify(list);
};

export const removeMessage = (id) => {
  if (!id) return;
  const pos = list.findIndex((u) => u.id === id );
  if (pos === -1) return;
  list = [
    ...list.slice(0, pos),
    ...list.slice(pos + 1),
  ];
  notify(list);
};

export const updateMessage = (id, data) => {
  if (!id) return;
  const existing = getUser(id);
  if (!existing) return;
  Object.assign(existing, data);
  notify(list);
};

export const clearUsers = async () => {
  list = [];
  notify(list);
};

export const watchUsers = watch;
