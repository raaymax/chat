/* eslint-disable no-undef */
import { getCid, setCid } from './store/channel';
import { setInfo } from './store/info.js';
import { setUser } from './store/user.js';
import { insertMessage, clearMessages, removeMessage } from './store/messages';
import { addChannel, rmChannel, clearChannels } from './store/channels';
import { load } from './services/messages';
import { loadChannels } from './services/channels';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { client } from './core';

client
  .on('setChannel', handleChannel)
  .on('addChannel', (_, msg) => addChannel(msg.channel))
  .on('rmChannel', (_, msg) => rmChannel(msg.cid))
  .on('typing', ackTyping)
  .on('auth:none', () => client.send({ type: 'greet' }))
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
  .on('notification', () => { try { navigator.vibrate([100, 30, 100]); } catch (err) { /* ignore */ } })
  .on('notification', () => { try { play(); } catch (err) { /* ignore */ } });

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
  setCid(msg.channel);
  load();
}
