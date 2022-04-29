import {
  getEarliestDate,
  getLatestDate,
  getMessage,
  insertPendingMessage,
  insertMessage,
  updateMessage,
} from '../store/messages.js';
import { getChannel } from '../store/channel.js';
import { client } from '../core';
import { fromDom } from '../MessageBuilder';
import * as files from '../store/file';

export const loadPrevious = () => client.req({ op: { type: 'load', channel: getChannel(), before: getEarliestDate() } });
export const loadNext = () => client.req({ op: { type: 'load', channel: getChannel(), after: getLatestDate() } });
export const load = () => client.req({ op: { type: 'load', channel: getChannel() } });

export const sendFromDom = async (dom) => {
  const msg = fromDom(dom);
  if (msg) {
    msg.attachments = [...files.getAll()];
    if (msg.flat.length === 0 && msg.attachments.length === 0) return;
    files.clear();
    return send(msg);
  }
};

export const send = async (msg) => {
  if (msg.command) return sendCommand(msg);
  sendMessage(msg);
};

export const resend = async (id) => {
  const msg = getMessage(id);
  msg.info = null;
  return sendMessage(msg);
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    insertMessage({ ...notif, notifType: 'error', notif: `${msg.command.name} error ${err.resp.data.message}` });
  }
};

const sendMessage = async (msg) => {
  if (!msg.user) {
    insertMessage({
      id: 'login', notifType: 'warning', notif: 'You must login first!', createdAt: new Date(),
    });
    return;
  }
  insertPendingMessage(msg);
  try {
    await client.req(msg);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    updateMessage(msg.clientId, {
      info: {
        msg: 'Sending message failed',
        type: 'error',
        action: () => resend(msg.clientId),
      },
    });
  }
};
