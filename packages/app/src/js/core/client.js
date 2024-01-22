/* eslint-disable no-undef */
import { Manager } from 'socket.io-client';

import { createEventListener } from '../utils';

const {
  notify, watch, once, exists,
} = createEventListener();

// eslint-disable-next-line no-console
const manager = new Manager(API_URL);

console.log('API_URL', API_URL);

const socket = manager.socket('/', {
  auth: (cb) => {
    cb({ token: localStorage.token });
  },
});

const seqHandlers = {};

const client = {
  socket,
  send: async (msg) => {
    // eslint-disable-next-line no-console
    console.debug('send', JSON.stringify(msg, null, 4));
    socket.send(msg);
  },
  onSeq: (seqId, cb) => {
    seqHandlers[seqId] = cb;
    return client;
  },
  offSeq: (seqId) => {
    delete seqHandlers[seqId];
    return client;
  },
  on: (ev, cb) => {
    watch(ev, cb);
    return client;
  },
  once: (ev, cb) => {
    once(ev, cb);
    return client;
  },
  // eslint-disable-next-line no-console
  emit: async (name, data) => {
    if (!exists(name)) {
      // eslint-disable-next-line no-console
      console.error(new Error(`[client] handler not exists: ${name}`, { extra: { name, data } }));
      return;
    }
    return notify(name, data);
  },
};

socket.on('message', (msg) => {
  // eslint-disable-next-line no-console
  console.debug('recv', JSON.stringify(msg, null, 4));
  if (seqHandlers[msg.seqId]) {
    seqHandlers[msg.seqId](msg);
  } else {
    client.emit(msg.type, msg);
  }
});
socket.on('connect', () => { console.log('connected') || client.emit('con:open'); });
socket.on('disconnect', () => { client.emit('con:close'); });

export default client;
