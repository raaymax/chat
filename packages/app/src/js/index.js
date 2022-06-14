/* eslint-disable no-undef */
import { getCid, setCid } from './store/channel';
import { setInfo } from './store/info';
import { setUserId } from './store/user';
import { getUser } from './store/users';
import { insertMessage, clearMessages, removeMessage } from './store/messages';
import { addChannel, rmChannel, clearChannels } from './store/channels';
import { loadMessages } from './services/messages';
import { loadChannels } from './services/channels';
import { loadUsers } from './services/users';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { client } from './core';

client
  .on('channel:changed', handleChannel)
  .on('channel', (_, msg) => addChannel(msg.channel))
  .on('rmChannel', (_, msg) => rmChannel(msg.cid))
  .on('typing', ackTyping)
  .on('auth:none', () => client.send({ type: 'greet' }))
  .on('auth:ready', () => setInfo(null))
  .on('auth:user', async (_, user) => {
    console.log(user);
    setUserId(user);
    await loadUsers(client);
    await loadChannels();
    await clearMessages();
    await loadMessages();
    //await load();
    //await loadChannels();
  })
  .on('auth:logout', async () => {
    setUser(null);
    clearMessages();
    clearChannels();
  })
  .on('con:close', () => setInfo({ msg: 'Disconnected - reconnect attempt in 1s', type: 'error' }))
  .on('message', async (client, msg) =>{
    msg.user = getUser(msg.userId);
    if(!msg.user) console.log(msg)
    await handleMessage(client, msg)
  })
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

function handleChannel() {
  clearMessages();
  loadMessages();
}
