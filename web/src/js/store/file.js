import { createNotifier } from '../utils.js';

const { notify, watch } = createNotifier();

const list = [];

export const findOne = (id) => list.find((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

export const findIdx = (id) => list.findIndex((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

export const add = (file) => {
  list.push(file);
  notify(list);
}

export const areReady = () => list.every((f) => f.progress === 100);

export const update = (id, file) => {
  const found = findOne(id);
  if (!found) return;
  Object.assign(found, file);
  notify(list);
}

export const remove = (id) => {
  const idx = findIdx(id);
  if (idx === -1) return;
  list.splice(idx, 1);
  notify(list);
}

export const clear = () => {
  list.length = 0;
  notify(list);
}

export const getAll = () => list;

export const watchFiles = watch;
