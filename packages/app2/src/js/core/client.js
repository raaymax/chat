/* eslint-disable no-undef */
import { Capacitor } from '@capacitor/core';
import Sentry from './sentry';

import { createEventListener } from '../utils';
import { createPool } from './pool';

const {
  notify, watch, once, exists,
} = createEventListener();

let protocol = 'ws:';
if (document.location.protocol === 'https:') {
  protocol = 'wss:';
}

// eslint-disable-next-line no-nested-ternary
const URI = Capacitor.isNativePlatform()
  ? SERVER_URL
  : `${protocol}//${document.location.host}/ws`;

// eslint-disable-next-line no-console
console.log('Connectiong to ', URI);
const pool = createPool(URI);

window.pool = pool;

const client = {
  send: async (msg) => {
    // eslint-disable-next-line no-console
    console.log('send', JSON.stringify(msg, null, 4));
    const raw = JSON.stringify(msg);
    await pool.send(raw);
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
  emit: async (name, ...data) => {
    if (!exists(name)) {
      Sentry.captureException(new Error(`[client] handler not exists: ${name}`));
      return;
    }
    console.log(name, data);
    return notify(name, client, ...data);
  },
};

pool.onOpen(() => notify('con:open', client));
pool.onClose(() => notify('con:close', client));
pool.onError(() => notify('con:error', client));
pool.onPacket((raw) => {
  try {
    const msg = JSON.parse(raw.data);
    // eslint-disable-next-line no-console
    console.log('recv', JSON.stringify(msg, null, 4));
    notify(msg.type, client, msg);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    Sentry.captureException(err);
    notify('packet:error', client, raw, err);
  }
});

export default client;
