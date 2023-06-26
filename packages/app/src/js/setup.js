/* eslint-disable no-undef */
import { play } from './services/sound';
import { sendShareMessage } from './services/messages';
import { init } from './services/init';
import { client } from './core';
import { store, actions, methods } from './store';

client
  .on('share', ({ data }) => store.dispatch(sendShareMessage(data)))
  .on('user', (msg) => actions.users.add(msg))
  .on('emoji', (msg) => actions.emoji.add(msg))
  .on('badge', (msg) => actions.progress.add(msg))
  .on('channel', (msg) => actions.channels.add(msg))
  .on('removeChannel', (msg) => actions.channel.remove(msg.channelId))
  .on('typing', (msg) => methods.typing.ack(msg))
  .on('con:open', () => store.dispatch(init()))
  .on('auth:user', (user) => actions.me.set(user))
  .on('auth:logout', () => actions.me.set(null))
  .on('con:close', () => {
    actions.connection.disconnected();
    actions.info.show({
      message: 'Disconnected - reconnect attempt in 1s',
      type: 'error',
    });
  })
  .on('message', (msg) => actions.messages.add({ ...msg, pending: false }))
  .on('notification', () => { try { navigator.vibrate([100, 30, 100]); } catch (err) { /* ignore */ } })
  .on('notification:click', (e) => {
    actions.stream.open({
      id: 'main',
      value: {
        type: 'archive',
        date: e.createdAt,
        channelId: e.channelId,
        selected: e.messageId,
        parentId: e.parentId,
      },
    });
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
