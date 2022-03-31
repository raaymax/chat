import { createNotifier } from '../utils.js';

const { notify, watch } = createNotifier();

let list = [];

export const getEarliestDate = () => (list.length ? list[0].createdAt : new Date());

export const getLatestDate = () => (list.length ? list[list.length - 1].createdAt : new Date());

export const getMessage = (id) => list.find((m) => m.id === id || m.clientId === id);
export const getMessages = () => list;

export const insertMessage = (msg) => {
  console.log(msg);
  msg.createdAt = new Date(msg.createdAt);
  const existing = list.find((m) => (m.id && m.id === msg.id)
    || (m.clientId && m.clientId === msg.clientId));
  if (existing) {
    Object.assign(existing, msg);
    return notify(list);
  }
  let pos = list.findIndex((m) => m.createdAt > msg.createdAt);
  if (pos === -1 && list.some((m) => m.createdAt < msg.createdAt)) pos = list.length;
  list = [
    ...list.slice(0, pos),
    msg,
    ...list.slice(pos),
  ];
  notify(list);
};

export const removeMessage = (id) => {
  if (!id) return;
  const pos = list.findIndex((m) => m.id === id || m.clientId === id);
  if (pos === -1) return;
  list = [
    ...list.slice(0, pos),
    ...list.slice(pos + 1),
  ];
  notify(list);
};

export const updateMessage = (id, data) => {
  if (!id) return;
  const existing = list.find((m) => m.id === id || m.clientId === id);
  if (!existing) return;
  Object.assign(existing, data);
  notify(list);
};

const SPAN = 50;

export const deleteBefore = (id) => {
  if (!id) return;
  const len = list.length;
  const idx = list.findIndex((m) => m.id === id || m.clientId === id);
  if (idx === -1) return;
  if (idx - SPAN <= 0) return;
  list = [
    ...list.slice(idx - SPAN, idx),
    ...list.slice(idx),
  ];
  if (len !== list.length) {
    notify(list);
  }
};

export const clearMessages = async () => {
  list = [];
  notify(list);
};

export const watchMessages = watch;
