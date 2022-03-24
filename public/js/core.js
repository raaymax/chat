import {setConfig, getConfig} from '/js/store/config.js';
import {getChannel, setChannel} from '/js/store/channel.js';
import {getSession, setSession} from '/js/store/session.js';
import {insertMessage, getMessage, clearMessages} from '/js/store/messages.js';
import {load} from '/js/services/messages.js';
import con from '/js/connection.js';

let greet = true;
con
  .on('ready', connectionReady)
  .on('ready', (srv) => greet && srv.send({op: {type: 'greet'}}).then(() => greet = false) )
  .on('packet', (srv, raw) => {
    const msg = JSON.parse(raw.data);
    if(msg.op) console.log(msg.op.type, msg.op);
  })
  .on('op:setSession', handleSession)
  .on('op:setConfig', (srv, msg) => setConfig(msg.op.config))
  .on('op:setChannel', handleChannel)
  .on('message', (srv, msg) => insertMessage(msg));

setInterval(async () => {
  console.time('ping');
  await con.req({op: {type: 'ping'}})
  console.timeEnd('ping');
}, 10000);

function connectionReady(srv) {
  try{
    load().then(() => console.log("Messages loaded"));
    const session = getSession();
    if(session){
      srv.req({op: {type: 'restore', session}});
    }
  }catch(err){
    console.error(err);
  }
}
function handleSession(srv, msg) {
  setSession(msg.op.session)
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
      console.log(cfg);
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: cfg.applicationServerKey,
      }).then(function(subscription) {
        console.log(subscription);
        con.send({
          op: {
            type: 'setNotifications',
            subscription,
          }
        })
      }).catch(function(e) {
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

