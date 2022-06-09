import { createNotifier } from '../utils.js';

const [notify, watch] = createNotifier();

const flags = {};

export const getFlags = () => flags;
export const setFlag = (name, val) => {
  flags[name] = val; notify(flags);
};
export const watchFlags = watch;
