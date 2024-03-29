import { client } from '../core';
import { createCounter } from '../utils';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

const loading = (dispatch) => {
  dispatch.actions.messages.loading();
  const timer = setTimeout(() => dispatch.actions.messages.loadingDone(), 1000);
  return () => {
    dispatch.actions.messages.loadingDone();
    clearTimeout(timer);
  };
};

const getStreamMessages = (stream, messages) => messages
  .filter((m) => m.channelId === stream.channelId
    && (
      ((!stream.parentId && !m.parentId) || m.parentId === stream.parentId)
    || (!stream.parentId && m.parentId === m.id)));

export const selectors = {
  countMessagesInStream: (stream, state) => getStreamMessages(stream, state.messages.data).length,
  getLatestDate: (stream, state) => {
    const data = getStreamMessages(stream, state.messages.data)
      .filter((m) => m.id !== stream.parentId);
    return data.length ? data[0].createdAt : new Date().toISOString();
  },
  getEarliestDate: (stream, state) => {
    const data = getStreamMessages(stream, state.messages.data)
      .filter((m) => m.id !== stream.parentId);
    return data.length ? data[data.length - 1].createdAt : new Date().toISOString();
  },
  getMessage: (id, state) => state.messages.data
    .find((m) => m.id === id || m.clientId === id) || null,
};

export const loadPrevious = (stream) => async (dispatch, getState) => {
  if (getState().messages.loading) return;
  const loadingDone = loading(dispatch, getState);
  const date = selectors.getEarliestDate(stream, getState());

  await dispatch.methods.messages.load({
    ...stream,
    before: date,
  });
  if (selectors.countMessagesInStream(stream, getState()) > 100) {
    setTimeout(() => {
      dispatch.actions.messages.takeOldest({ stream, count: 100 });
    }, 10);
  }
  loadingDone();
};

export const loadNext = (stream) => async (dispatch, getState) => {
  if (getState().messages.loading) return;
  const loadingDone = loading(dispatch, getState);
  const date = selectors.getLatestDate(stream, getState());

  const messages = await dispatch.methods.messages.load({
    ...stream,
    after: date,
  });
  if (messages?.length > 0) {
    dispatch.methods.progress.update(messages[0].id);
  }
  if (selectors.countMessagesInStream(stream, getState()) > 100) {
    setTimeout(() => {
      dispatch.actions.messages.takeYoungest({ stream, count: 100 });
    }, 10);
  }
  loadingDone();
  return messages.length
};

export const loadMessagesArchive = (stream) => async (dispatch, getState) => {
  if (!stream.channelId) return;
  const { date } = stream;
  const loadingDone = loading(dispatch, getState);
  dispatch.actions.messages.clear({ stream });
  await dispatch.methods.messages.load({
    ...stream,
    before: date,
  });
  const messages = await dispatch.methods.messages.load({
    ...stream,
    after: date,
  });
  if (messages?.length > 0) dispatch.methods.progress.update(messages[0].id);
  loadingDone();
};

export const loadMessagesLive = (stream) => async (dispatch, getState) => {
  if (!stream.channelId) return;
  const loadingDone = loading(dispatch, getState);
  const messages = await dispatch.methods.messages.load(stream);
  if (messages?.length > 0) dispatch.methods.progress.update(messages[0].id);
  loadingDone();
};

export const loadMessages = (stream) => async (dispatch) => {
  if (stream.type === 'archive') {
    dispatch(loadMessagesArchive(stream));
  } else {
    dispatch(loadMessagesLive(stream));
  }
};

export const sendFromDom = (stream, dom) => async (dispatch, getState) => {
  const msg = fromDom(dom, getState());
  if (msg) {
    msg.attachments = [...getState().files.filter((f) => f.streamId === stream.id)];
    if (msg.flat.length === 0 && msg.attachments.length === 0) return;
    msg.debug = dom.innerHTML;
    msg.channelId = stream.channelId;
    msg.parentId = stream.parentId;
    dispatch.actions.files.clear(stream.id);
    dispatch(send(stream, msg));
    dispatch(loadMessagesLive(stream));
  }
};

export const send = (stream, msg) => (dispatch) => dispatch(msg.type === 'command:execute' ? sendCommand(stream, msg) : sendMessage(msg));

export const sendShareMessage = (data) => async (dispatch, getState) => {
  const { channelId, parentId } = getState().stream.main;
  const info = { links: [] };
  const msg = build({
    type: 'message:create',
    channelId,
    parentId,
    flat: `${data.title} ${data.text} ${data.url}`,
    message: buildShareMessage(data, info),
  }, getState());
  msg.links = info.links;
  dispatch.actions.messages.add({ ...msg, pending: true });
  try {
    await client.notif(msg);
  } catch (err) {
    dispatch.actions.messages.add({
      clientId: msg.clientId,
      channelId: msg.channelId,
      parentId: msg.parentId,
      info: {
        msg: 'Sending message failed',
        type: 'error',
        action: 'resend',
      },
    });
  }
};

const buildShareMessage = (data, info) => {
  const lines = [];
  if (data.title) {
    lines.push({ line: { bold: processUrls(data.title, info) } });
  }
  if (data.text) {
    lines.push({ line: processUrls(data.text, info) });
  }
  if (data.url) {
    lines.push({ line: processUrls(data.url, info) });
  }
  return lines;
};

export const sendCommand = (stream, msg) => async (dispatch) => {
  const notif = {
    type: 'notif',
    userId: 'notif',
    clientId: msg.clientId,
    channelId: stream.channelId,
    parentId: stream.parentId,
    notifType: 'info',
    notif: `${msg.name} sent`,
    createdAt: (new Date()).toISOString(),
  };
  // eslint-disable-next-line no-undef
  msg.context = { ...stream, appVersion: APP_VERSION };
  dispatch.actions.messages.add(notif);
  try {
    await client.notif(msg);
    dispatch.actions.messages.add({ ...notif, notifType: 'success', notif: `${msg.name} executed successfully` });
  } catch (err) {
    dispatch.actions.messages.add({ ...notif, notifType: 'error', notif: `${msg.name} error ${err.res.message || err.message}` });
  }
};

const sendMessage = (msg) => async (dispatch) => {
  dispatch.actions.messages.add({ ...msg, pending: true });
  try {
    await client.notif(msg);
  } catch (err) {
    dispatch.actions.messages.add({
      clientId: msg.clientId,
      channelId: msg.channelId,
      parentId: msg.parentId,
      info: {
        msg: 'Sending message failed',
        type: 'error',
        action: 'resend',
      },
    });
  }
};

export const resend = (id) => (dispatch, getState) => {
  const msg = selectors.getMessage(id, getState());
  dispatch(sendMessage({
    clientId: msg.clientId,
    channelId: msg.channelId,
    parentId: msg.parentId,
    info: {
      msg: 'Resending',
      type: 'warning',
    },
  }));
};

export const removeMessage = (msg) => async (dispatch) => {
  try {
    await client.notif({ type: 'message:remove', id: msg.id });
  } catch (err) {
    dispatch.actions.messages.add({
      id: msg.id,
      notifType: null,
      notif: null,
      info: {
        type: 'error',
        msg: 'Could not delete message',
      },
    });
  }
};

// eslint-disable-next-line no-useless-escape
const matchUrl = (text) => text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!,@:%_\+.~#?&\/\/=]*)/g);

const trim = (arr) => {
  const copy = [...arr];
  const startIdx = copy.findIndex(
    (e) => !(e.text === '' || e.text === '\u200B' || e.text === '\u00A0' || e.text?.trim() === '' || e.br === true),
  );
  const endIdx = copy.findLastIndex(
    (e) => !(e.text === '' || e.text === '\u200B' || e.text === '\u00A0' || e.text?.trim() === '' || e.br === true),
  );
  return copy.slice(startIdx, endIdx + 1);
};

const isEmojiOnly = (tree) => {
  const a = trim(tree);
  if (a.length === 1 && a[0].emoji) return true;
  if (a.length === 1 && a[0].line) {
    return isEmojiOnly(a[0].line);
  }
  return false;
};

export function build(msg, state) {
  msg.clientId = tempId();
  msg.userId = state.me;
  msg.createdAt = new Date().toISOString();
  msg.info = null;
  return msg;
}

function flatten(tree) {
  return tree.map((n) => {
    if (n.text || n.text === '') return n.text;
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
    if (n.code) return flatten(n.code);
    if (n.br) return '\n';
    // eslint-disable-next-line no-console
    console.log('unknown node', n);
    return '';
  }).flat().join('');
}

export const fromDom = (dom, state) => {
  const command = dom.textContent.trim().match(/^\/\w+( \S+)*/);
  if (command) {
    const m = dom.textContent.trim().replace('\n', '').slice(1).split(/\s+/);
    return build({
      type: 'command:execute',
      name: m[0],
      args: m.splice(1),
      flat: dom.textContent,
    }, state);
  }
  if (dom.childNodes.length === 0) {
    return build({
      type: 'message:create',
      message: [],
      flat: '',
    }, state);
  }
  const info = {
    links: [],
    mentions: [],
  };
  const tree = mapNodes(dom, info);

  return build({
    type: 'message:create',
    message: trim(tree),
    emojiOnly: isEmojiOnly(tree),
    parsingErrors: info.errors,
    flat: flatten(tree),
    ...info,
  }, state);
};

const mapNodes = (dom, info) => (!dom.childNodes ? [] : [...dom.childNodes].map((n) => {
  if (n.nodeName === '#text') return processUrls(n.nodeValue, info);
  if (n.nodeName === 'U') return { underline: mapNodes(n, info) };
  if (n.nodeName === 'CODE') return { code: mapNodes(n, info) };
  if (n.nodeName === 'A') return { link: { href: n.attributes.href.nodeValue, children: mapNodes(n, info) } };
  if (n.nodeName === 'B') return { bold: mapNodes(n, info) };
  if (n.nodeName === 'I') return { italic: mapNodes(n, info) };
  if (n.nodeName === 'S') return { strike: mapNodes(n, info) };
  if (n.nodeName === 'DIV') return { line: mapNodes(n, info) };
  if (n.nodeName === 'UL') return { bullet: mapNodes(n, info) };
  if (n.nodeName === 'LI') return { item: mapNodes(n, info) };
  if (n.nodeName === 'IMG') return { img: { src: n.attributes.src.nodeValue, alt: n.attributes.alt.nodeValue } };
  if (n.nodeName === 'SPAN' && n.className === 'emoji') return { emoji: n.attributes.emoji.value };
  if (n.nodeName === 'SPAN' && n.className === 'channel') return { channel: n.attributes.channelId.value };
  if (n.nodeName === 'SPAN' && n.className === 'user') return processUser(n, info);
  if (n.nodeName === 'SPAN') return mapNodes(n, info);
  if (n.nodeName === 'BR') return { br: true };
  // eslint-disable-next-line no-console
  console.log('unknown node', n, n.nodeName);
  info.errors = info.errors || [];
  info.errors.push({ message: 'unknown node', nodeAttributes: Object.keys(n.attributes).reduce((acc, key) => ({ ...acc, [key]: n.attributes[key].nodeValue })), nodeName: n.nodeName });
  return { text: '' };
}).flat());

function processUser(n, info) {
  info.mentions.push(n.attributes.userId.value);
  return { user: n.attributes.userId.value };
}

function processUrls(text, info) {
  const m = matchUrl(text);
  if (m) {
    const parts = text.split(m[0]);
    info.links.push(m[0]);
    return [
      { text: parts[0] },
      { link: { href: m[0], children: [{ text: m[0] }] } },
      ...processUrls(parts[1]),
    ];
  }
  return [{ text }];
}
