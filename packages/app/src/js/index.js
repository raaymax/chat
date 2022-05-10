/* eslint-disable no-undef */
import { getCid, setCid } from './store/channel';
import { setInfo } from './store/info.js';
import { setUser, getUser } from './store/user.js';
import { insertMessage, clearMessages, removeMessage } from './store/messages';
import { addChannel, rmChannel, clearChannels } from './store/channels';
import { load } from './services/messages';
import { loadChannels } from './services/channels';
import { play } from './services/sound';
import { client } from './core';

client
  .on('op:setChannel', handleChannel)
  .on('op:addChannel', (_, msg) => addChannel(msg.op.channel))
  .on('op:rmChannel', (_, msg) => rmChannel(msg.op.cid))
  .on('op:typing', (_, msg) => msg.user.id !== getUser().id && setInfo({ msg: `${msg.user.name} is typing`, type: 'info' }, 1000))
  .on('auth:none', () => client.send({ op: { type: 'greet' } }))
  .on('auth:ready', () => setInfo(null))
  .on('auth:user', async (_, user) => {
    setUser(user);
    clearMessages();
    await load();
    await loadChannels();
  })
  .on('auth:logout', async () => {
    setUser(null);
    clearMessages();
    clearChannels();
  })
  .on('con:close', () => setInfo({ msg: 'Disconnected - reconnect attempt in 1s', type: 'error' }))
  .on('message', handleMessage)
  .on('message:remove', handleMessageRemove)
  .on('notification', () => { try { navigator.vibrate([100, 30, 100]) } catch (err) { /* ignore */ } })
  .on('notification', () => { try { play(); } catch (err) { /* ignore */ } })

window.addEventListener('hashchange', () => {
  const name = window.location.hash.slice(1);
  client.send({ command: { name: 'channel', args: [name] } });
}, false);

function handleMessage(_, msg) {
  if (msg.priv || msg.channel === getCid()) {
    insertMessage(msg);
  }
}
function handleMessageRemove(_, id) {
  removeMessage(id);
}

function handleChannel(_, msg) {
  clearMessages();
  setCid(msg.op.channel);
  load();
}
