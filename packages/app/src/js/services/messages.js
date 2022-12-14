import { client } from '../core';
import { createCounter } from '../utils';
import { actions, selectors } from '../state';
import { updateProgress } from './progress';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

export const loadPrevious = (channelId) => async (dispatch, getState) => {
  if (selectors.getMessagesPrevLoading(getState())) return;
  dispatch(actions.selectMessage(null));
  dispatch(actions.messagesLoadingPrev());
  try {
    const req = await client.req2({
      type: 'load',
      channelId: selectors.getChannelId(getState()),
      before: selectors.getEarliestDate()(getState()),
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInChannel(channelId, getState()) > 100) {
      dispatch(actions.messagesSetStatus('archive'));
      setTimeout(() => {
        dispatch(actions.takeHead({channelId, count: 100}));
      }, 1)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // TODO: handle error message
  }
  dispatch(actions.messagesLoadingPrevDone());
}

export const loadNext = (channelId) => async (dispatch, getState) => {
  if (selectors.getMessagesNextLoading(getState())) return;
  dispatch(actions.selectMessage(null));
  dispatch(actions.messagesLoadingNext());
  try {
    const req = await client.req2({
      type: 'load',
      channelId: selectors.getChannelId(getState()),
      after: selectors.getLatestDate()(getState()),
      limit: 50,
    })
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id))
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInChannel(channelId, getState()) > 100) {
      setTimeout(() => {
        dispatch(actions.takeTail({channelId, count: 100}));
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

export const loadArchive = ({channelId, id, date}) => async (dispatch) => {
  try {
    dispatch(actions.messagesSetStatus('archive'));
    dispatch(actions.selectMessage(id));
    dispatch(actions.messagesLoadingNext());
    dispatch(actions.messagesLoadingPrev());
    dispatch(actions.messagesClear({channelId}))
    const req2 = await client.req2({
      type: 'load',
      channelId,
      before: date,
      limit: 50,
    })
    dispatch(actions.messagesLoadingPrevDone());
    dispatch(actions.addMessages(req2.data));
    const req = await client.req2({
      type: 'load',
      channelId,
      after: date,
      limit: 50,
    })
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id))
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
      channelId: selectors.getChannelId(getState()),
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id))
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
    msg.debug = dom.innerHTML;
    dispatch(actions.clearFiles());
    dispatch(send(msg));
  }
};

export const send = (msg) => (dispatch) => dispatch(msg.type === 'command' ? sendCommand(msg) : sendMessage(msg));

export const sendCommand = (msg) => async (dispatch, getState) => {
  const channelId = selectors.getChannelId(getState());
  const notif = {
    userId: 'notif',
    channelId,
    clientId: msg.clientId,
    notifType: 'info',
    notif: `${msg.name} sent`,
    createdAt: (new Date()).toISOString(),
  };
  // eslint-disable-next-line no-undef
  msg.context = {channelId, appVersion: APP_VERSION};
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
      channelId: msg.channelId,
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
      id: msg.id,
      notifType: null,
      notif: null,
      info: {
        type: 'error',
        msg: 'Could not delete message',
      },
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
  if (dom.childNodes.length === 0) {
    return build({
      type: 'message',
      message: [],
      flat: '',
    }, state);
  }
  const info = {};
  const tree = mapNodes(dom, info);

  return build({
    type: 'message',
    message: tree,
    emojiOnly: isEmojiOnly(tree),
    parsingErrors: info.errors,
    flat: dom.textContent,
  }, state);
};

const trim = (arr) => {
  const copy = [...arr];
  const idx = copy.reverse().findIndex(
    (e) => !(e.text === '' || e.text === '\u200B' || e.text === '\u00A0' || e.br === true),
  );
  return copy.slice(idx).reverse();
}

const isEmojiOnly = (tree) => {
  const arr = trim(tree);
  if (arr.length === 1 && arr[0].emoji) return true;
  return false;
}

export function build(msg, state) {
  msg.channelId = selectors.getChannelId(state);
  msg.clientId = tempId();
  msg.userId = state.users.meId;
  msg.createdAt = new Date().toISOString();
  msg.info = null;
  return msg;
}

// eslint-disable-next-line no-useless-escape
const matchUrl = (text) => text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g);

const mapNodes = (dom, info) => (!dom.childNodes ? [] : [...dom.childNodes].map((n) => {
  if (n.nodeName === '#text') return processUrls(n.nodeValue);
  if (n.nodeName === 'U') return { underline: mapNodes(n, info) };
  if (n.nodeName === 'A') return { link: { href: n.attributes.href.nodeValue, children: mapNodes(n, info) } };
  if (n.nodeName === 'B') return { bold: mapNodes(n, info) };
  if (n.nodeName === 'I') return { italic: mapNodes(n, info) };
  if (n.nodeName === 'S') return { strike: mapNodes(n, info) };
  if (n.nodeName === 'DIV') return { line: mapNodes(n, info) };
  if (n.nodeName === 'UL') return { bullet: mapNodes(n, info) };
  if (n.nodeName === 'LI') return { item: mapNodes(n, info) };
  if (n.nodeName === 'IMG') return { img: {src: n.attributes.src.nodeValue, alt: n.attributes.alt.nodeValue }};
  if (n.nodeName === 'SPAN' && n.className === 'emoji') return { emoji: n.attributes.emoji.value };
  if (n.nodeName === 'SPAN' && n.className === 'channel') return { channel: n.attributes.channelId.value };
  if (n.nodeName === 'SPAN') return mapNodes(n, info);
  if (n.nodeName === 'BR') return { br: true };
  // eslint-disable-next-line no-console
  console.log('unknown node', n, n.nodeName);
  info.errors = info.errors || [];
  info.errors.push('unknown node');
  return { text: '' };
}).flat());

function processUrls(text) {
  const m = matchUrl(text);
  if (m) {
    const parts = text.split(m[0]);
    return [
      { text: parts[0] },
      { link: { href: m[0], children: [{ text: m[0] }] } },
      ...processUrls(parts[1]),
    ];
  }
  return [{text}];
}
