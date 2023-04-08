/* eslint-disable no-undef */
import { loadProgress } from './services/progress';
import { play } from './services/sound';
import { ackTyping } from './services/typing';
import { sendShareMessage } from './services/messages';
import { init } from './services/init';
import { client } from './core';
import { setStream } from './services/stream';
import store, {actions} from './state';

client
  .on('share', ({data}) => store.dispatch(sendShareMessage(data)))
  .on('user', (msg) => store.dispatch(actions.addUser(msg)))
  .on('emoji', (msg) => store.dispatch(actions.addEmoji(msg)))
  .on('badge', (msg) => store.dispatch(actions.addProgress(msg)))
  .on('channel', (msg) => store.dispatch(actions.addChannel(msg)))
  .on('removeChannel', (msg) => store.dispatch(actions.removeChannel(msg.channelId)))
  .on('typing', (msg) => store.dispatch(ackTyping(msg)))
  .on('con:open', () => store.dispatch(init(true)))
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
  .on('notification:click', (e) => {
    store.dispatch(setStream('main', {
      type: 'archive',
      date: e.createdAt,
      channelId: e.channelId,
      selected: e.messageId,
      parentId: e.parentId,
    }));
  })
  .on('notification', () => { try { play(); } catch (err) { /* ignore */ } });

/*
setTimeout(() => {
  const data = {title: 'oko', text: 'dupa', url: 'https://google.com/'};
  const formData  = new FormData();

  for(const name in data) {
    formData.append(name, data[name]);
  }

  fetch('http://localhost:8080/share/', {
    method: 'POST',
    body: formData,
  });
}, 2000);
*/
