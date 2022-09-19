/* eslint-disable no-undef */
import { loadMessages } from './services/messages';
import { loadChannels } from './services/channels';
import { loadUsers } from './services/users';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { greet } from './services/greet';
import { client } from './core';
import store, {actions} from './state';

client
  .on('config', (msg) => store.dispatch(actions.setAppVersion(msg.appVersion)))
  .on('user', (msg) => store.dispatch(actions.addUser(msg)))
  .on('channel:changed', (msg) => {
    store.dispatch(actions.setChannel(msg.channel));
    store.dispatch(loadMessages());
  })
  .on('setChannel', (msg) => { window.location.hash = msg.channel; })
  .on('channel', (msg) => store.dispatch(actions.addChannel(msg)))
  .on('removeChannel', (msg) => store.dispatch(actions.removeChannel(msg.cid)))
  .on('typing', (msg) => store.dispatch(ackTyping(msg)))
  .on('auth:none', () => store.dispatch(greet()))
  .on('search', (msg) => store.dispatch(actions.addSearchResult(msg)))
  .on('con:open', () => {
    store.dispatch(actions.connected());
    store.dispatch(actions.clearInfo());
    store.dispatch(loadUsers());
    store.dispatch(loadChannels());
    store.dispatch(loadMessages());
  })
  .on('auth:user', (user) => store.dispatch(actions.setMe(user)))
  .on('auth:logout', () => store.dispatch(actions.setMe(null))) // TODO: check if that works
  .on('con:close', () => {
    store.dispatch(actions.disconnected());
    store.dispatch(actions.showInfo({
      message: 'Disconnected - reconnect attempt in 1s',
      type: 'error',
    }));
  })
  .on('message', (msg) => store.dispatch(actions.addMessage({...msg, pending: false })))
  .on('notification', () => { try { navigator.vibrate([100, 30, 100]); } catch (err) { /* ignore */ } })
  .on('notification', () => { try { play(); } catch (err) { /* ignore */ } });
