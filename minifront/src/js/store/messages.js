let list = [];
let map = {};
const listeners = [];
let cooldown = null;

const notify = () => {
  if(cooldown) clearTimeout(cooldown)
  cooldown = setTimeout(() => listeners.forEach(l => l()), 10);
}

export const getMessage = (id) => map[id];

export const getMessages = () => list;

export const insertMessage = (msg) => {
  map[msg.id] = msg;
  const pos = list.findIndex(m => m.createdAt > msg.createdAt);
  list = [
    ...list.slice(0,pos),
    msg,
    ...list.slice(pos)
  ];
  notify();
};

export const   clearMessages = () => {
  map = {};
  list = [];
  notify();
};

export const watchMessages = (handler) => listeners.push(handler);
