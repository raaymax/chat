let list = [];
let map = {};
const listeners = [];
let cooldown = null;
const MAX_LENGHT = 15;

const notify = () => {
  if(cooldown) clearTimeout(cooldown)
  cooldown = setTimeout(() => listeners.forEach(l => l(list)), 10);
}

export const getMessage = (id) => map[id];

export const getMessages = () => list;

export const insertMessage = (msg) => {
  map[msg.id] = msg;
  const d = (list.length + 1) - MAX_LENGHT;
  const D = d > 0 ? d : 0;
  for ( const el of list.slice(0, D)) {
    delete map[el.id];
  }
  let pos = list.findIndex(m => m.createdAt > msg.createdAt);
  if(pos === -1 && list.some(m => m.createdAt < msg.createdAt)) pos = list.length;
  list = [
    ...list.slice(D,pos),
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
