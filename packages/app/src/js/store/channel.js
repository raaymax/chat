import { createNotifier } from '../utils.js';

const { notify, watch } = createNotifier();

let channel = window.location.hash.slice(1) || 'main';

export const getChannel = () => channel;

export const setChannel = (c) => {
  channel = c;
  notify(channel);
};

export const watchChannel = watch;
