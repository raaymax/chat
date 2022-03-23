let list = [];
let map = {};
const listeners = [];
let cooldown = null;

const notify = () => {
  if(cooldown) clearTimeout(cooldown)
  cooldown = setTimeout(() => listeners.forEach(l => l(list)), 10);
}

export const getEarliestDate = () => list[0].createdAt;

export const getLatestDate = () => list.length ? list[list.length -1].createdAt : new Date();

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

const SPAN = 20;

export const deleteBefore = (id) => {
  const idx = list.findIndex(m => m.id === id);
  console.log(idx);
  if(idx === -1) return;
  if(idx - SPAN <= 0) return 
  list = [
    ...list.slice(idx-SPAN,idx),
    ...list.slice(idx)
  ];
  notify();
}

export const   clearMessages = () => {
  map = {};
  list = [];
  notify();
};

export const watchMessages = (handler) => listeners.push(handler);
