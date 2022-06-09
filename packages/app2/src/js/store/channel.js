import { createNotifier } from '../utils.js';

const [notify, watch] = createNotifier();

let channel = window.location.hash.slice(1) || 'main';

export const getCid = () => channel;

export const setCid = (c) => {
  channel = c;
  notify(channel);
};

export const watchCid = watch;
