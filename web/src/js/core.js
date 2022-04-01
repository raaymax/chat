import { setConfig, getConfig } from './store/config.js';
import { getChannel, setChannel } from './store/channel.js';
import { getSession, setSession } from './store/session.js';
import { setInfo } from './store/info.js';
import { setUser, getUser } from './store/user.js';
import { insertMessage, clearMessages } from './store/messages.js';
import { load } from './services/messages.js';
import client from './client';

client
  .on('con:open', connectionReady)
  .on('con:open', (srv) => !getSession() && srv.send({ op: { type: 'greet' } }))
  .on('op:setSession', handleSession)
  .on('op:setConfig', (srv, msg) => setConfig(msg.op.config))
  .on('op:setChannel', handleChannel)
  .on('op:typing', (srv, msg) => msg.user.id !== getUser().id && setInfo({ msg: `${msg.user.name} is typing`, type: 'info' }, 1000))
  .on('message', handleMessage)
  .on('con:close', () => {
    setInfo({ msg: 'Disconnected - reconnect attempt in 1s', type: 'error' });
  });

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

window.addEventListener('hashchange', () => {
  const name = window.location.hash.slice(1);
  client.send({ command: { name: 'channel', args: [name] } });
}, false);

async function connectionReady(srv) {
  setInfo(null);
  try {
    const session = getSession();
    if (session) {
      await srv.req({ op: { type: 'restore', session } });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    insertMessage({ notifType: 'warning', notif: 'User session not restored', createdAt: new Date() });
  }
}

async function handleSession(srv, msg) {
  setSession(msg.op.session);
  setUser(msg.op.user);
  await subscribeNotifications();
  clearMessages();
  await load();
}

function handleMessage(srv, msg) {
  if (msg.channel === getChannel()) {
    insertMessage(msg);
  }
}

function handleChannel(srv, msg) {
  clear();
  setChannel(msg.op.channel);
  load();
}

async function subscribeNotifications() {
  if ('serviceWorker' in navigator) {
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
