import { client } from '../core';
import { createCounter } from '../utils';
import { actions, selectors } from '../state';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

export const loadPrevious = (channel) => async (dispatch, getState) => {
  if (selectors.getMessagesPrevLoading(getState())) return;
  dispatch(actions.selectMessage(null));
  dispatch(actions.messagesLoadingPrev());
  try {
    const req = await client.req2({
      type: 'load',
      channel: selectors.getCid(getState()),
      before: selectors.getEarliestDate()(getState()),
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInChannel(channel, getState()) > 100) {
      dispatch(actions.messagesSetStatus('archive'));
      setTimeout(() => {
        dispatch(actions.takeHead({channel, count: 100}));
      }, 1)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // TODO: handle error message
  }
  dispatch(actions.messagesLoadingPrevDone());
}

export const loadNext = (channel) => async (dispatch, getState) => {
  if (selectors.getMessagesNextLoading(getState())) return;
  dispatch(actions.selectMessage(null));
  dispatch(actions.messagesLoadingNext());
  try {
    const req = await client.req2({
      type: 'load',
      channel: selectors.getCid(getState()),
      after: selectors.getLatestDate()(getState()),
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInChannel(channel, getState()) > 100) {
      setTimeout(() => {
        dispatch(actions.takeTail({channel, count: 100}));
      }, 1)
    }
    if (req.data.length < 50) {
      setTimeout(() => {
        dispatch(actions.messagesSetStatus('live'));
      }, 2)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // TODO: handle error message
  }
  dispatch(actions.messagesLoadingNextDone());
}

export const loadArchive = ({channel, id, date}) => async (dispatch) => {
  try {
    dispatch(actions.messagesSetStatus('archive'));
    dispatch(actions.selectMessage(id));
    dispatch(actions.messagesLoadingNext());
    dispatch(actions.messagesLoadingPrev());
    dispatch(actions.messagesClear({channel}))
    const req2 = await client.req2({
      type: 'load',
      channel,
      before: date,
      limit: 50,
    })
    dispatch(actions.messagesLoadingPrevDone());
    dispatch(actions.addMessages(req2.data));
    const req = await client.req2({
      type: 'load',
      channel,
      after: date,
      limit: 50,
    })
    dispatch(actions.messagesLoadingNextDone());
    dispatch(actions.addMessages(req.data));
    if (req.data.length < 50) {
      setTimeout(() => {
        dispatch(actions.messagesSetStatus('live'));
      }, 2)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

export const loadMessages = () => async (dispatch, getState) => {
  dispatch(actions.selectMessage(null));
  dispatch(actions.messagesLoading());
  try {
    const req = await client.req2({
      type: 'load',
      channel: selectors.getCid(getState()),
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // TODO: handle error message
  }
  dispatch(actions.messagesLoadingDone());
}

export const addReaction = (id, text) => async (dispatch) => {
  try {
    const req = await client.req2({
      type: 'reaction',
      id,
      reaction: text.trim(),
    });
    dispatch(actions.addMessages(req.data));
  } catch (err) {
  }
};

export const sendFromDom = (dom) => async (dispatch, getState) => {
  const msg = fromDom(dom, getState());
  if (msg) {
    msg.attachments = [...selectors.getFiles(getState())];
    if (msg.flat.length === 0 && msg.attachments.length === 0) return;
    dispatch(actions.clearFiles());
    dispatch(send(msg));
  }
};

export const send = (msg) => (dispatch) => dispatch(msg.type === 'command' ? sendCommand(msg) : sendMessage(msg));

export const sendCommand = (msg) => async (dispatch, getState) => {
  const cid = selectors.getCid(getState());
  const notif = {
    userId: 'notif',
    channel: cid,
    clientId: msg.clientId,
    notifType: 'info',
    notif: `${msg.name} sent`,
    createdAt: (new Date()).toISOString(),
  };
  // eslint-disable-next-line no-undef
  msg.context = {channel: cid, appVersion: APP_VERSION};
  dispatch(actions.addMessage(notif));
  try {
    await client.req(msg);
    dispatch(actions.addMessage({ ...notif, notifType: 'success', notif: `${msg.name} executed successfully` }));
  } catch (err) {
    dispatch(actions.addMessage({ ...notif, notifType: 'error', notif: `${msg.name} error ${err.message}` }));
  }
};

const sendMessage = (msg) => async (dispatch) => {
  dispatch(actions.addMessage({...msg, pending: true}));
  try {
    await client.req(msg);
  } catch (err) {
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
  msg.channel = selectors.getCid(state);
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
