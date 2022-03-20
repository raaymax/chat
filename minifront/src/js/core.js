import {h,t, formatTime} from '/js/utils.js';
import {message} from '/js/message.js';
import {buildHtmlFromMessage} from '/js/formatter.js';
import {setConfig, getConfig} from '/js/store/config.js';
import {insertMessage, getMessage, clearMessages} from '/js/store/messages.js';
import con from '/js/connection.js';

window.channel = 'main';
const messages = document.querySelector('#root > .message-list')

con.on('ready', connectionReady)
  .on('packet', (srv, raw) => {
    const msg = JSON.parse(raw.data);
    if(msg.op) console.log(msg.op.type, msg.op);
  })
  .on('op:setSession', setSession)
  .on('op:setConfig', (srv, msg) => setConfig(msg.op.config))
  .on('op:setChannel', setChannel)
  .on('message', createMessage)

function connectionReady(srv) {
  try{
    document.getElementById('workspace-header').innerHTML = channel;
    srv.send({op: {type: 'load', channel}});
    const session = JSON.parse(localStorage.getItem('session'));
    if(session){
      srv.send({op: {type: 'restore', session}});
    }
  }catch(err){
    console.error(err);
  }
}
function setSession(srv, msg) {
  console.log('setSession', msg);
  localStorage.setItem('session', JSON.stringify(msg.op.session));
  subscribeNotifications();
}

function setChannel(srv, msg) {
  clear();
  channel = msg.op.channel;
  document.getElementById('workspace-header').innerHTML = channel;
  srv.send({op: {type: 'load', channel: msg.op.channel}});
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
  messages.innerHTML = '';
  clearMessages();
}

function createMessage(srv, msg) {
  insertMessage(msg);
  const m = message({class: msg.private ? ['private'] : [], 'data-id': msg.id}, {
    author: h('span', {class: 'spacy author'}, [t(msg.user?.name || 'Guest')]),
    content: h('div', {}, buildHtmlFromMessage(msg.message)),
    date: h('span', {class: 'spacy time'}, [t(formatTime(msg.createdAt))]),
  })
  insertInOrder(messages, m);
  messages.scrollTo(0,messages.scrollHeight);
}

function insertInOrder(messages, m){
	const date = getMessage(m.getAttribute('data-id')).createdAt;
	if(messages.children.length === 0) {
		messages.appendChild(m);
	}	else {
		for (const m2 of messages.children) {
			const date2 = getMessage(m2.getAttribute('data-id')).createdAt;
			if(date2 > date){
				messages.insertBefore(m, m2);
				return;
			}
		}
		messages.appendChild(m);
	}
}
