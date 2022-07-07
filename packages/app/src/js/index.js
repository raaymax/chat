/* eslint-disable no-undef */
import { loadMessages } from './services/messages';
import { loadChannels } from './services/channels';
import { loadUsers } from './services/users';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { client } from './core';
import store, {actions} from './state';

client
  .on('config', (msg) => {
    store.dispatch(actions.setAppVersion(msg.appVersion));
  })
  .on('user', (msg) => {
    store.dispatch(actions.addUser(msg));
  })
  .on('channel:changed', (msg) => {
    store.dispatch(actions.setChannel(msg.channel));
    // TODO: clear messages, do I need to clear messages here?
    store.dispatch(loadMessages());
  })
  .on('setChannel', (msg) => {
    window.location.hash = msg.channel;
  })
  .on('channel', (msg) => {
    store.dispatch(actions.addChannel(JSON.parse(JSON.stringify(msg)))); // FIXME
  })
  .on('removeChannel', (msg) => {
    console.log(msg);
    store.dispatch(actions.removeChannel(msg.cid));
    // TODO remove channel from list
  })
  .on('typing', (msg) => {
    store.dispatch(ackTyping(msg))
  })
  .on('auth:none', () => client.send({ type: 'greet' }))
  .on('con:open', async () => {
    store.dispatch(actions.connected());
    store.dispatch(actions.clearInfo());
    store.dispatch(loadUsers());
    store.dispatch(loadChannels());
    store.dispatch(loadMessages());
  })
  .on('auth:user', async (user) => {
    store.dispatch(actions.setMe(user));
    // await loadChannels();
    // await loadMessages();
  })
  .on('auth:logout', async () => {
    store.dispatch(actions.setMe(null)); // TODO: check if that works
    // TODO: clear messages
  })
  .on('con:close', () => {
    store.dispatch(actions.disconnected());
    store.dispatch(actions.showInfo({
      message: 'Disconnected - reconnect attempt in 1s',
      type: 'error',
    }));
  })
  .on('message', async (msg) => {
    store.dispatch(actions.addMessage({
      ...JSON.parse(JSON.stringify(msg)),
      pending: false,
    }));
  })
  .on('message:remove', (_id) => {
    // TODO remove message
  })
  .on('notification', () => {
    try {
      navigator.vibrate([100, 30, 100]);
    } catch (err) { /* ignore */ }
  })
  .on('notification', () => { try { play(); } catch (err) { /* ignore */ } });
