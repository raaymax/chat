/* eslint-disable no-undef */
import { getCid, setCid } from './store/channel';
import { setInfo } from './store/info';
import { setUserId } from './store/user';
import { insertMessage, clearMessages, removeMessage } from './store/messages';
import { addChannel, rmChannel, clearChannels } from './store/channels';
import { loadMessages } from './services/messages';
import { loadChannels } from './services/channels';
import { loadUsers } from './services/users';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { client } from './core';

client
  .on('channel:changed', (_, msg) => {
    setCid(msg.channel)
    clearMessages();
    loadMessages();
  })
  .on('setChannel', (_, msg) => {
    window.location.hash = msg.channel;
  })
  .on('channel', (_, msg) => addChannel(msg))
  .on('removeChannel', (_, msg) => rmChannel(msg.cid))
  .on('typing', ackTyping)
  .on('auth:none', () => client.send({ type: 'greet' }))
  .on('con:open', async () => {
    setInfo(null);
    await loadChannels();
    await loadMessages();
  })
  .on('auth:user', async (_, user) => {
    setUserId(user);
    await loadUsers();
    await loadChannels();
    await clearMessages();
    await loadMessages();
  })
  .on('auth:logout', async () => {
    setUserId(null);
    clearMessages();
    clearChannels();
  })
  .on('con:close', () => setInfo({
    msg: 'Disconnected - reconnect attempt in 1s',
    type: 'error',
  }))
  .on('message', async (client, msg) => {
    if (msg.priv || msg.channel === getCid()) {
      insertMessage(msg);
    }
  })
  .on('message:remove', (_, id) => removeMessage(id))
  .on('notification', () => {
    try {
      navigator.vibrate([100, 30, 100]);
    } catch (err) { /* ignore */ }
  })
  .on('notification', () => { try { play(); } catch (err) { /* ignore */ } });
