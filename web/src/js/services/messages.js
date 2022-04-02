import {
  getEarliestDate,
  getLatestDate,
  insertMessage,
  updateMessage,
} from '../store/messages.js';
import { getChannel } from '../store/channel.js';
import client from '../client';
import { fromQuill } from '../MessageBuilder';

export const loadPrevious = () => client.req({ op: { type: 'load', channel: getChannel(), before: getEarliestDate() } });
export const loadNext = () => client.req({ op: { type: 'load', channel: getChannel(), after: getLatestDate() } });
export const load = () => client.req({ op: { type: 'load', channel: getChannel() } });

export const sendFromQuill = async (delta) => {
  const msg = fromQuill(delta);
  send(msg);
};

export const send = async (msg) => {
  if (msg.command) return sendCommand(msg);
  sendMessage(msg);
};

export const sendCommand = async (msg) => {
  const notif = {
    clientId: msg.clientId,
    notifType: 'info',
    notif: `${msg.command.name} sent`,
    createdAt: new Date(),
  };
  insertMessage(notif);
  try {
    await client.req(msg);
    insertMessage({ ...notif, notifType: 'success', notif: `${msg.command.name} executed successfully` });
  } catch (errr) {
    insertMessage({ ...notif, notifType: 'error', notif: `${msg.command.name} executed error` });
  }
};

const sendMessage = async (msg) => {
  if (!msg.user) {
    insertMessage({
      id: 'login', notifType: 'warning', notif: 'You must login first!', createdAt: new Date(),
    });
    return;
  }
  insertMessage(msg);
  try {
    await client.req(msg);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    updateMessage(msg.clientId, { info: { msg: 'Sending message failed', type: 'error' } });
  }
};
