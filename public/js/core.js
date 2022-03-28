import {setConfig, getConfig} from '/js/store/config.js';
import {getChannel, setChannel} from '/js/store/channel.js';
import {getSession, setSession, clearSession} from '/js/store/session.js';
import {setInfo} from '/js/store/info.js';
import {setUser} from '/js/store/user.js';
import {insertMessage, getMessage, clearMessages} from '/js/store/messages.js';
import {load} from '/js/services/messages.js';
import con from '/js/connection.js';

con
  .on('ready', connectionReady)
  .on('ready', (srv) => !getSession() && srv.send({op: {type: 'greet'}}))
  .on('packet', (srv, raw) => {
    const msg = JSON.parse(raw.data);
    if(msg.op) console.log(msg.op.type, msg.op);
  })
  .on('op:setSession', handleSession)
  .on('op:setConfig', (srv, msg) => setConfig(msg.op.config))
  .on('op:setChannel', handleChannel)
  .on('op:typing', (srv, msg) => setInfo({msg: msg.user.name + " is typing", type: 'info'}, 1000))
  .on('message', (srv, msg) => insertMessage(msg))
  .on('disconnect', (srv) => {
    setInfo({msg: "Disconnected - reconnect attempt in 1s", type: 'error'});
  });

setInterval(async () => {
  const start = new Date();
  try{
    await con.req({op: {type: 'ping'}})
  }catch(err){
    console.error(err);
  }finally {
    if(window.debug){
      insertMessage({notifType: 'debug', notif: "Ping: " + (new Date() - start) + "ms", createdAt: new Date()})
    }
  }
}, 10000);

window.addEventListener('hashchange', () => {
  const name = location.hash.slice(1);
  console.log('hash changed', name);
  con.send({command: {name: 'channel', args: [name]}});
}, false);


async function connectionReady(srv) {
  setInfo(null);
  try{
    const session = getSession();
    if(session){
      await srv.req({op: {type: 'restore', session}});
    }
  }catch(err){
    clearSession();
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
  if(msg.channel === getChannel()){
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
    await navigator.serviceWorker.ready.then(async function(reg) {
      const cfg = await getConfig();
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: cfg.applicationServerKey,
      }).then(function(subscription) {
        return con.req({
          op: {
            type: 'setupPushNotifications',
            subscription,
          }
        })
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          console.warn('Permission for notifications was denied');
        } else {
          console.error('Unable to subscribe to push', e);
        }
      });
    })
  }
}

function clear() {
  clearMessages();
}

