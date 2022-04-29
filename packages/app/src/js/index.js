/* eslint-disable no-undef */
import { getChannel, setChannel } from './store/channel.js';
import { setInfo } from './store/info.js';
import { setUser, getUser } from './store/user.js';
import { insertMessage, clearMessages, removeMessage } from './store/messages.js';
import { load } from './services/messages.js';
import { play } from './services/sound';
import { client } from './core';

client
  .on('op:setChannel', handleChannel)
  .on('op:typing', (_, msg) => msg.user.id !== getUser().id && setInfo({ msg: `${msg.user.name} is typing`, type: 'info' }, 1000))
  .on('auth:none', () => client.send({ op: { type: 'greet' } }))
  .on('auth:ready', () => setInfo(null))
  .on('auth:user', async (_, user) => {
    setUser(user);
    clearMessages();
    await load();
  })
  .on('con:close', () => setInfo({ msg: 'Disconnected - reconnect attempt in 1s', type: 'error' }))
  .on('message', handleMessage)
  .on('message:remove', handleMessageRemove)
  .on('notification', () => navigator.vibrate([100, 30, 100]))
  .on('notification', () => play())

window.addEventListener('hashchange', () => {
  const name = window.location.hash.slice(1);
  client.send({ command: { name: 'channel', args: [name] } });
}, false);

function handleMessage(_, msg) {
  if (msg.priv || msg.channel === getChannel()) {
    insertMessage(msg);
  }
}
function handleMessageRemove(_, id) {
  removeMessage(id);
}

function handleChannel(_, msg) {
  clearMessages();
  setChannel(msg.op.channel);
  load();
}
