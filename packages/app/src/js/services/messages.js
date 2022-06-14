import {
  getEarliestDate,
  getLatestDate,
  getMessage,
  insertPendingMessage,
  insertMessage,
  updateMessage,
} from '../store/messages';
import { getCid } from '../store/channel';
import { client } from '../core';
import { fromDom } from '../MessageBuilder';
import * as files from '../store/file';

export const loadPrevious = () => client.req({ type: 'load', channel: getCid(), before: getEarliestDate() });
export const loadNext = () => client.req({ type: 'load', channel: getCid(), after: getLatestDate() });
export const loadMessages = () => client.req({ type: 'load', limit:50, channel: getCid() });

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
  if (msg.type === 'command') return sendCommand(msg);
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
    notif: `${msg.cmd} sent`,
    createdAt: new Date(),
  };
  insertMessage(notif);
  try {
    await client.req(msg);
    insertMessage({ ...notif, notifType: 'success', notif: `${msg.cmd} executed successfully` });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    insertMessage({ ...notif, notifType: 'error', notif: `${msg.cmd} error ${err.data.message}` });
  }
};

export const removeMessage = async (msg) => {
  try {
    await client.req({ type: 'removeMessage', id: msg.id });
  } catch (err) {
    insertMessage({
      id: msg.id, notifType: null, notif: null, info: { type: 'error', msg: 'Could not delete message' },
    });
  }
};

const sendMessage = async (msg) => {
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
