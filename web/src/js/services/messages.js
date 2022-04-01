import {
  getEarliestDate,
  getLatestDate,
  insertMessage,
  updateMessage,
} from '../store/messages.js';
import { getChannel } from '../store/channel.js';
import { getUser } from '../store/user.js';
import client from '../client';

export const loadPrevious = () => client.req({ op: { type: 'load', channel: getChannel(), before: getEarliestDate() } });
export const loadNext = () => client.req({ op: { type: 'load', channel: getChannel(), after: getLatestDate() } });
export const load = () => client.req({ op: { type: 'load', channel: getChannel() } });

const createCounter = (prefix) => {
  let counter = 0;
  return () => `${prefix}:${counter++}`;
};

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

export const send = async (msg) => {
  if (msg.command) return sendCommand(msg);
  sendMessage(msg);
};

export const sendCommand = async (msg) => {
  const id = tempId();
  insertMessage({
    id, notifType: 'info', notif: `${msg.command.name} sent`, createdAt: new Date(),
  });
  try {
    await client.req(msg);
    insertMessage({
      id, notifType: 'success', notif: `${msg.command.name} executed successfully`, createdAt: new Date(),
    });
  } catch (errr) {
    insertMessage({
      id, notifType: 'error', notif: `${msg.command.name} error`, createdAt: new Date(),
    });
  }
};

const sendMessage = async (msg) => {
  const user = getUser();
  if (!user) {
    insertMessage({
      id: 'login', notifType: 'warning', notif: 'You must login first!', createdAt: new Date(),
    });
    return;
  }
  msg.channel = getChannel();
  msg.clientId = tempId();
  msg.user = getUser();
  msg.createdAt = new Date();
  insertMessage(msg);
  try {
    await client.req(msg);
  } catch (errr) {
    updateMessage(msg.clientId, { info: { msg: 'Sending message failed', type: 'error' } });
  }
};
