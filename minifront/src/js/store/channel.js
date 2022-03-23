let channel = 'main';
const listeners = [];
let cooldown = null;

const notify = () => {
  if(cooldown) clearTimeout(cooldown)
  cooldown = setTimeout(() => listeners.forEach(l => l(channel)), 10);
}

export const getChannel = () => channel;

export const setChannel = (c) => {
  channel = c;
  notify();
};

export const watchChannel = (handler) => listeners.push(handler);
