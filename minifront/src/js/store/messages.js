let list = [];
let map = {};
const listeners = [];
let cooldown = null;

const notify = () => {
  if(cooldown) clearTimeout(cooldown)
  cooldown = setTimeout(() => listeners.forEach(l => l(list)), 10);
}

export const getMessage = (id) => map[id];

export const getMessages = () => list;

export const insertMessage = (msg) => {
  map[msg.id] = msg;
  let pos = list.findIndex(m => m.createdAt > msg.createdAt);
  if(pos === -1 && list.some(m => m.createdAt < msg.createdAt)) pos = list.length;
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
