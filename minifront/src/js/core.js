import {h,t, formatTime} from '/js/utils.js';
import {createConnection} from '/js/connection.js';
import {message} from '/js/message.js';
import {buildHtmlFromMessage} from '/js/formatter.js';
import {setConfig, getConfig} from '/js/store/config.js';
import {insertMessage, getMessage, clearMessages} from '/js/store/messages.js';

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
        WS.send({
          op: {
            type: 'set:notifications',
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

const messages = document.querySelector('#root > .message-list')

window.channel = 'main';
(async () => {
  window.WS = await createConnection((ws) => {
    ws.addEventListener('message', (raw)=>{
      try{
        const msg = JSON.parse(raw.data);
        if(msg.op) return handleOps(msg);
        createMessage(msg);
      } catch(err) {
        console.error(err);
      }
    });
  }, (WS) => {
    try{
      document.getElementById('workspace-header').innerHTML = channel;
      WS.send({op: {type: 'load', channel}});
      const session = JSON.parse(localStorage.getItem('session'));
      if(session){
        WS.send({op: {type: 'restore', session}});
      }
    }catch(err){
      console.error(err);
    }
  });

})();

function handleOps(msg) {
  console.log(msg.op.type, msg.op);
  if(msg.op.type === 'set:session') {
    localStorage.setItem('session', JSON.stringify(msg.op.session));
    subscribeNotifications();
  }
  if(msg.op.type === 'set:config') {
    setConfig(msg.op.config);
  }
  if(msg.op.type === 'set:channel') {
    clear();
    channel = msg.op.channel;
    document.getElementById('workspace-header').innerHTML = channel;
    WS.send({op: {type: 'load', channel: msg.op.channel}});
  }
}

function clear() {
  messages.innerHTML = '';
  clearMessages();
}

function createMessage(msg) {
  insertMessage(msg);
  const m = message({class: msg.private ? ['private'] : [], 'data-id': msg.id}, {
    author: h('span', {class: 'spacy author'}, [t(msg.user?.name || 'Guest')]),
    content: h('span', {}, buildHtmlFromMessage(msg.message)),
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
