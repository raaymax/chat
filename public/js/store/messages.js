import {createNotifier} from '/js/utils.js';
const {notify, watch} = createNotifier();

let list = [];
let map = {};

export const getEarliestDate = () => list[0].createdAt;

export const getLatestDate = () => list.length ? list[list.length -1].createdAt : new Date();

export const getMessage = (id) => map[id];

export const getMessages = () => list;

export const insertMessage = (msg) => {
  if(map[msg.id]){
    Object.assign(map[msg.id], msg);
    notify(list);
    return;
  }
  msg.createdAt = new Date(msg.createdAt);
  map[msg.id] = msg;
  let pos = list.findIndex(m => m.createdAt > msg.createdAt);
  if(pos === -1 && list.some(m => m.createdAt < msg.createdAt)) pos = list.length;
  list = [
    ...list.slice(0,pos),
    msg,
    ...list.slice(pos)
  ];
  notify(list);
};

export const removeMessage = (id) => {
  if(!map[id]) return;
  delete map[id];
  let pos = list.findIndex(m => m.id === id);
  list = [
    ...list.slice(0,pos),
    ...list.slice(pos+1)
  ];
  notify(list);
}
export const updateMessage = (id, data) => {
  if(!map[id]) return;
  Object.assign(map[id], data);
  notify(list);
}

const SPAN = 20;

export const deleteBefore = (id) => {
  const len = list.length;
  const idx = list.findIndex(m => m.id === id);
  if(idx === -1) return;
  if(idx - SPAN <= 0) return 
  const remove = list.slice(0, idx-SPAN);
  list = [
    ...list.slice(idx-SPAN,idx),
    ...list.slice(idx)
  ];
  remove.forEach(m => {delete map[m.id];});
  if(len !== list.length){
    notify(list);
  }
}

export const clearMessages = async () => {
  map = {};
  list = [];
  notify(list);
};

export const watchMessages = watch;
