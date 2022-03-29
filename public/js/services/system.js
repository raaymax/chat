import {setConfig, getConfig} from '/js/store/config.js';
import {getChannel, setChannel} from '/js/store/channel.js';
import {getSession, setSession} from '/js/store/session.js';
import {setInfo} from '/js/store/info.js';
import {setUser} from '/js/store/user.js';
import {insertMessage, getMessage, clearMessages} from '/js/store/messages.js';
import {load} from '/js/services/messages.js';
import con from '/js/connection.js';

setInterval(ping, 10000);

async function ping() {
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
}

async function restoreSession() {
  try{
    const session = getSession();
    if(session){
      return await srv.req({op: {type: 'restore', session}});
    }
  }catch(err){
    if(err.resp.status !== 'timeout'){
      clearSession();
    }
    return null;
  }
}

async function connectionReady(srv) {
  setInfo(null);
  const {resp: {data}} = await restoreSession();
  await load();
  getUser() && subscribeNotifications();
}

function handleSession(srv, msg) {
  setSession(msg.op.session);
  setUser(msg.op.user);
  subscribeNotifications();
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

function subscribeNotifications() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(async function(reg) {
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
