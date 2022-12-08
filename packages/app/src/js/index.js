/* eslint-disable no-undef */
import { loadMessages } from './services/messages';
import { loadProgress } from './services/progress';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { init } from './services/init';
import { client } from './core';
import store, {actions} from './state';

client
  .on('user', (msg) => store.dispatch(actions.addUser(msg)))
  .on('emoji', (msg) => store.dispatch(actions.addEmoji(msg)))
  .on('badge', (msg) => store.dispatch(actions.addProgress(msg)))
  .on('channel:changed', (msg) => {
    store.dispatch(actions.setChannel(msg.channel));
    store.dispatch(loadProgress());
    store.dispatch(loadMessages());
  })
  .on('setChannel', (msg) => { window.location.hash = msg.channel; })
  .on('channel', (msg) => store.dispatch(actions.addChannel(msg)))
  .on('removeChannel', (msg) => store.dispatch(actions.removeChannel(msg.cid)))
  .on('typing', (msg) => store.dispatch(ackTyping(msg)))
  .on('con:open', () => store.dispatch(init()))
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
