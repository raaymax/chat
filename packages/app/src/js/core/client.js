/* eslint-disable no-undef */
import { Capacitor } from '@capacitor/core';
import { Manager } from "socket.io-client";
import Sentry from './sentry';

import { createEventListener } from '../utils';

const {
  notify, watch, once, exists,
} = createEventListener();

// eslint-disable-next-line no-nested-ternary
const URI = Capacitor.isNativePlatform()
  ? SERVER_URL
  : `${document.location.protocol}//${document.location.host}`;

// eslint-disable-next-line no-console
console.log('Connectiong to cycki ', URI);
const manager = new Manager(URI, {
  reconnectionDelay: 500,
  reconnectionDelayMax: 2000,
  timeout: 2000,
  withCredentials: true,
});

const socket = manager.socket('/');

const client = {
  socket,
  send: async (msg) => {
    // eslint-disable-next-line no-console
    console.log('send', JSON.stringify(msg, null, 4));
    socket.send(msg);
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
      Sentry.captureException(new Error(`[client] handler not exists: ${name}`));
      return;
    }
    return notify(name, data);
  },
};

socket.on('message', (msg) => {
  // eslint-disable-next-line no-console
  console.log('recv', JSON.stringify(msg, null, 4));
  client.emit(msg.type, msg);
});
socket.on('connect', () => { client.emit('con:open'); });
socket.on('disconnect', () => { client.emit('con:close'); });

export default client;
