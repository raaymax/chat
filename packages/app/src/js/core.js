import { Capacitor } from '@capacitor/core';
import { setConfig, getConfig } from './store/config.js';
import { getChannel, setChannel } from './store/channel.js';
import { getSession, setSession } from './store/session.js';
import { setInfo } from './store/info.js';
import { setUser, getUser } from './store/user.js';
import { insertMessage, clearMessages, removeMessage } from './store/messages.js';
import { load } from './services/messages.js';
import client from './client';
import { play } from './services/sound';
import {initNotifications} from './services/notifications';

window.client = client;

client
  .on('op:setConfig', handleConfig)
  .on('op:setSession', handleSession)
  .on('op:setChannel', handleChannel)
  .on('op:typing', (srv, msg) => msg.user.id !== getUser().id && setInfo({ msg: `${msg.user.name} is typing`, type: 'info' }, 1000))
  .on('message', handleMessage)
  .on('con:close', () => {
    setInfo({ msg: 'Disconnected - reconnect attempt in 1s', type: 'error' });
  });

if ( 'serviceWorker' in navigator ) {
  navigator.serviceWorker.addEventListener('message', () => {
    play();
    navigator.vibrate([100, 30, 100]);
  });
}

setInterval(async () => {
  const start = new Date();
  try {
    await client.req({ op: { type: 'ping' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    if (window.debug) {
      insertMessage({ notifType: 'debug', notif: `Ping: ${new Date() - start}ms`, createdAt: new Date() });
    }
  }
}, 10000);

function handleConfig(srv, msg) {
  // eslint-disable-next-line no-undef
  if (APP_VERSION) {
    // eslint-disable-next-line no-console, no-undef
    console.log('version check: ', APP_VERSION, msg.op.config.appVersion);
    // eslint-disable-next-line no-undef
    if (msg.op.config.appVersion !== APP_VERSION) {
      if (Capacitor.isNativePlatform()) {
        insertMessage({
          id: 'version',
          createdAt: new Date(),
          user: {
            name: 'System',
          },
          message: [
            { line: { bold: { text: 'Your Quack app version is outdated!!' } } },
            { line: { text: 'Please update' } },
          ],
        });
        return;
      }
      setTimeout(() => window.location.reload(true), 5000);
      insertMessage({
        id: 'version',
        createdAt: new Date(),
        user: {
          name: 'System',
        },
        message: [
          { line: { bold: { text: 'Your Quack version is outdated!!' } } },
          { line: { text: 'Please reload the page to update' } },
        ],
      });
      return;
    }
  }
  setConfig(msg.op.config);
  connectionReady();
}

window.addEventListener('hashchange', () => {
  const name = window.location.hash.slice(1);
  client.send({ command: { name: 'channel', args: [name] } });
}, false);

async function connectionReady() {
  setInfo(null);
  try {
    const session = getSession();
    if (session) {
      await restoreSession();
    } else {
      await client.send({ op: { type: 'greet' } });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

async function restoreSession(i = 1) {
  if (i > 10) throw new Error('SESSION_NOT_RESTORED');
  // eslint-disable-next-line no-console
  console.log('Restore session attempt', i);
  try {
    const session = getSession();
    if (session) {
      await client.req({ op: { type: 'restore', session } });
      removeMessage('session');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    insertMessage({
      clientId: 'session', notifType: 'warning', notif: 'User session not restored', createdAt: new Date(),
    });
    const errorCode = err?.resp?.data?.errorCode;
    if (errorCode !== 'SESSION_TERMINATED' && errorCode !== 'SESSION_NOT_FOUND') {
      return new Promise((resolve, reject) => {
        setTimeout(() => restoreSession(i + 1).then(resolve, reject), 2000);
      });
    }
    throw new Error('SESSION_NOT_RESTORED');
  }
}

async function handleSession(srv, msg) {
  try {
    setSession(msg.op.session);
    setUser(msg.op.user);
    subscribeNotifications();
    clearMessages();
    await load();
  } catch(err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

function handleMessage(srv, msg) {
  if (msg.priv || msg.channel === getChannel()) {
    insertMessage(msg);
  }
}

function handleChannel(srv, msg) {
  clear();
  setChannel(msg.op.channel);
  load();
}

async function subscribeNotifications() {
  if ( Capacitor.isNativePlatform() ) return initNotifications();
  if ( 'serviceWorker' in navigator ) {
    await navigator.serviceWorker.ready.then(async (reg) => {
      const cfg = await getConfig();
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: cfg.applicationServerKey,
      }).then((subscription) => client.req({
        op: {
          type: 'setupPushNotifications',
          subscription,
        },
      // eslint-disable-next-line no-console
      })).catch((e) => console.error(e));
    });
  }
}

function clear() {
  clearMessages();
}
