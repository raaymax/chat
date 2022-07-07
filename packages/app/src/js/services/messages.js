import { client } from '../core';
import { createCounter } from '../utils';
import { actions, selectors } from '../state';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

export const loadPrevious = () => async (dispatch, getState) => client.req({ 
  type: 'load',
  channel: getState().channels.current,
  before: selectors.getEarliestDate()(getState())
});
export const loadNext = () => null; // TODO  client.req({ type: 'load', channel: getCid(), after: getLatestDate() });

export const loadMessages = () => (dispatch, getState) => {
  console.log('loadMessages');
  client.req({ type: 'load', limit: 50, channel: getState().channels.current });
}

export const sendFromDom = (dom) => async (dispatch, getState) => {
  const msg = fromDom(dom, getState());
  if (msg) {
    msg.attachments = [...getState().files.list];
    if (msg.flat.length === 0 && msg.attachments.length === 0) return;
    dispatch(actions.clearFiles());
    dispatch(send(msg));
  }
};

export const send = (msg) => (dispatch) => dispatch(msg.type === 'command' ? sendCommand(msg) : sendMessage(msg));

export const sendCommand = (msg) => async (dispatch, getState) => {
  const cid = getState().channels.current;
  const notif = {
    userId: 'notif',
    channel: cid,
    clientId: msg.clientId,
    notifType: 'info',
    notif: `${msg.name} sent`,
    createdAt: (new Date()).toISOString(),
  };
  msg.context = {channel: cid};
  console.log(notif, msg);
  dispatch(actions.addMessage(notif));
  try {
    await client.req(msg);
    console.log('sent');
    dispatch(actions.addMessage({ ...notif, notifType: 'success', notif: `${msg.name} executed successfully` }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    dispatch(actions.addMessage({ ...notif, notifType: 'error', notif: `${msg.name} error ${err.message}` }));
  }
};

const sendMessage = (msg) => async (dispatch) => {
  dispatch(actions.addMessage({...msg, pending: true}));
  try {
    await client.req(msg);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    dispatch(actions.addMessage({
      clientId: msg.clientId,
      info: {
        msg: 'Sending message failed',
        type: 'error',
        action: 'resend',
      },
    }));
  }
};

export const resend = (id) => (dispatch, getState) => {
  const msg = selectors.getMessage(id)(getState());
  dispatch(sendMessage({
    ...msg,
    info: null,
  }));
};

export const removeMessage = (msg) => async (dispatch) => {
  try {
    await client.req({ type: 'removeMessage', id: msg.id });
  } catch (err) {
    dispatch(actions.addMessage({
      id: msg.id, notifType: null, notif: null, info: { type: 'error', msg: 'Could not delete message' },
    }));
  }
};

export const fromDom = (dom, state) => {
  const command = dom.textContent.trim().match(/^\/\w+( \S+)*/);
  if (command) {
    const m = dom.textContent.trim().replace('\n', '').slice(1).split(/\s+/);
    return build({
      type: 'command',
      name: m[0],
      args: m.splice(1),
      flat: dom.textContent,
    }, state);
  }
  if (dom.childNodes.length === 0) return build({ type: 'message', message: [], flat: '' }, state);

  return build({ type: 'message', message: mapNodes(dom), flat: dom.textContent }, state);
};

export function build(msg, state) {
  msg.channel = state.channels.current;
  msg.clientId = tempId();
  msg.userId = state.users.meId;
  msg.createdAt = new Date().toISOString();
  msg.info = null;
  return msg;
}

const KEYS = [
  'bullet',
  'ordered',
  'item',
  'codeblock',
  'blockquote',
  'code',
  'line',
  'text',
  'br',
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'emoji',
];

const flat = (datas) => [datas].flat().map((data) => {
  if (typeof data === 'string') return data;

  const key = Object.keys(data).find((f) => KEYS.includes(f));
  if (!key) return '';
  return type(key, data[key]);
}).join('');

function type(t, data) {
  switch (t) {
  case 'br':
    return '';
  case 'link':
    return flat(data.children);
  default:
    return flat(data);
  }
}

const mapNodes = (dom) => (!dom.childNodes ? [] : [...dom.childNodes].map((n) => {
  if (n.nodeName === '#text') return { text: n.nodeValue };
  if (n.nodeName === 'U') return { underline: mapNodes(n) };
  if (n.nodeName === 'A') return { link: { href: n.attributes.href.nodeValue, children: mapNodes(n) } };
  if (n.nodeName === 'B') return { bold: mapNodes(n) };
  if (n.nodeName === 'I') return { italic: mapNodes(n) };
  if (n.nodeName === 'S') return { strike: mapNodes(n) };
  if (n.nodeName === 'SPAN') return mapNodes(n);
  if (n.nodeName === 'BR') return { br: true };
  return { text: '' };
}).flat());
