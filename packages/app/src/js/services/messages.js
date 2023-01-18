import { client } from '../core';
import { createCounter } from '../utils';
import { actions, selectors } from '../state';
import { updateProgress } from './progress';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

const loading = (dispatch, getState) => {
  if (selectors.getMessagesLoading(getState())) throw new Error('busy');
  dispatch(actions.messagesLoading());
  const timer = setTimeout(() => dispatch(actions.messagesLoadingDone()), 1000);
  return () => {
    dispatch(actions.messagesLoadingDone());
    clearTimeout(timer);
  }
}

export const loadPrevious = (stream) => async (dispatch, getState) => {
  try {
    const loadingDone = loading(dispatch, getState);
    dispatch(actions.setStream({
      id: stream.id,
      value: {
        ...stream,
        selected: undefined,
        date: undefined,
      },
    }));
    dispatch(actions.selectMessage(null));
    const req = await client.req2({
      ...stream,
      type: 'load',
      before: selectors.getEarliestDate()(getState()),
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInStream(stream, getState()) > 100) {
      dispatch(actions.setStream({id: stream.id, value: {...stream, type: 'archive'}}));
      setTimeout(() => {
        dispatch(actions.takeHead({stream, count: 100}));
      }, 1)
    }
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    // TODO: handle error message
  }
}

export const loadNext = (stream) => async (dispatch, getState) => {
  try {
    const loadingDone = loading(dispatch, getState);
    dispatch(actions.setStream({
      id: stream.id,
      value: {
        ...stream,
        selected: undefined,
        date: undefined,
      },
    }));
    dispatch(actions.selectMessage(null));
    const req = await client.req2({
      ...stream,
      type: 'load',
      after: selectors.getLatestDate()(getState()),
      limit: 50,
    })
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id))
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInStream(stream, getState()) > 100) {
      setTimeout(() => {
        dispatch(actions.takeTail({stream, count: 100}));
      }, 1)
    }
    if (req.data.length < 50) {
      setTimeout(() => {
        dispatch(actions.setStream({id: stream.id, value: {...stream, type: 'live'}}));
      }, 2)
    }
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    // TODO: handle error message
  }
}

export const loadMessagesArchive = (stream) => async (dispatch, getState) => {
  if (!stream.channelId) return;
  const {date} = stream;
  try {
    const loadingDone = loading(dispatch, getState);
    dispatch(actions.messagesClear({stream}))
    const req2 = await client.req2({
      ...stream,
      type: 'load',
      before: date,
      limit: 50,
    })
    dispatch(actions.addMessages(req2.data));
    const req = await client.req2({
      ...stream,
      type: 'load',
      after: date,
      limit: 50,
    })
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id))
    dispatch(actions.addMessages(req.data));
    if (req.data.length < 50) {
      setTimeout(() => {
        // setStream({...stream, type: 'live'});
      }, 2)
    }
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

export const loadMessagesLive = (stream) => async (dispatch, getState) => {
  if (!stream.channelId) return;
  try {
    const loadingDone = loading(dispatch, getState);
    const req = await client.req2({
      ...stream,
      type: 'load',
      limit: 50,
    })
    dispatch(actions.addMessages(req.data));
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id))
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    // TODO: handle error message
  }
}

export const loadMessages = (stream) => async (dispatch) => {
  if (stream.type === 'archive') {
    dispatch(loadMessagesArchive(stream));
  } else {
    dispatch(loadMessagesLive(stream));
  }
};

export const addReaction = (id, text) => async (dispatch) => {
  try {
    const req = await client.req2({
      type: 'reaction',
      id,
      reaction: text.trim(),
    });
    dispatch(actions.addMessages(req.data));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export const sendFromDom = (stream, dom) => async (dispatch, getState) => {
  const msg = fromDom(dom, getState());
  if (msg) {
    msg.attachments = [...selectors.getFiles(getState())];
    if (msg.flat.length === 0 && msg.attachments.length === 0) return;
    msg.debug = dom.innerHTML;
    msg.channelId = stream.channelId;
    msg.parentId = stream.parentId;
    dispatch(actions.clearFiles());
    dispatch(send(stream, msg));
  }
};

export const send = (stream, msg) => (dispatch) => console.log(msg) || dispatch(msg.type === 'command' ? sendCommand(stream, msg) : sendMessage(msg));

export const sendCommand = (stream, msg) => async (dispatch) => {
  const notif = {
    userId: 'notif',
    clientId: msg.clientId,
    notifType: 'info',
    notif: `${msg.name} sent`,
    createdAt: (new Date()).toISOString(),
  };
  // eslint-disable-next-line no-undef
  msg.context = {...stream, appVersion: APP_VERSION};
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
    flat: flatten(tree),
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

function flatten(tree) {
  return tree.map((n) => {
    if (n.text) return n.text;
    if (n.emoji) return n.emoji;
    if (n.img) return n.img.alt;
    if (n.link) return flatten(n.link.children);
    if (n.underline) return flatten(n.underline);
    if (n.bold) return flatten(n.bold);
    if (n.italic) return flatten(n.italic);
    if (n.strike) return flatten(n.strike);
    if (n.line) return [flatten(n.line), '\n'];
    if (n.bullet) return flatten(n.bullet);
    if (n.item) return flatten(n.item);
    if (n.br) return '\n';
    // eslint-disable-next-line no-console
    console.log('unknown node', n);
    return '';
  }).flat().join('');
}
