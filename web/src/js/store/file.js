import { createNotifier } from '../utils.js';

const { notify, watch } = createNotifier();

const list = [];

export const findOne = (id) => list.find((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

export const add = (file) => {
  list.push(file);
  notify(list);
}

export const update = (id, file) => {
  const found = findOne(id);
  Object.assign(found, file);
  notify(list);
}

export const getAll = () => list;

export const watchFiles = watch;
