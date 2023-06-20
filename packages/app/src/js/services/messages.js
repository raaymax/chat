import { client } from '../core';
import { createCounter } from '../utils';
import { actions, selectors } from '../state';
import { updateProgress } from './progress';
import * as url from './url';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

const loading = (dispatch) => {
  dispatch(actions.messagesLoading());
  const timer = setTimeout(() => dispatch(actions.messagesLoadingDone()), 1000);
  return () => {
    dispatch(actions.messagesLoadingDone());
    clearTimeout(timer);
  };
};

export const loadPrevious = (stream, saveLocation = false) => async (dispatch, getState) => {
  try {
    const loadingDone = loading(dispatch, getState);
    dispatch(actions.patchStream({
      id: stream.id,
      patch: {
        selected: null,
        date: null,
      },
    }));
    dispatch(actions.selectMessage(null));
    const date = selectors.getEarliestDate(stream)(getState());
    const req = await client.req({
      ...stream,
      type: 'messages:load',
      before: date,
      limit: 50,
    });
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInStream(stream)(getState()) > 100) {
      dispatch(actions.patchStream({ id: stream.id, patch: { type: 'archive' } }));
      setTimeout(() => {
        dispatch(actions.takeHead({ stream, count: 100 }));
      }, 1);
    }
    if (saveLocation) {
      url.saveStream({
        type: 'archive',
        channelId: stream.channelId,
        parentId: stream.parentId,
        date,
      });
    }
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    // TODO: handle error message
  }
};

export const loadNext = (stream, saveLocation = false) => async (dispatch, getState) => {
  try {
    const loadingDone = loading(dispatch, getState);
    dispatch(actions.patchStream({
      id: stream.id,
      patch: {
        selected: null,
        date: null,
      },
    }));
    dispatch(actions.selectMessage(null));
    const date = selectors.getLatestDate(stream)(getState());
    const req = await client.req({
      ...stream,
      type: 'messages:load',
      after: date,
      limit: 50,
    });
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id));
    dispatch(actions.addMessages(req.data));
    if (selectors.countMessagesInStream(stream)(getState()) > 100) {
      setTimeout(() => {
        dispatch(actions.takeTail({ stream, count: 100 }));
      }, 1);
    }
    if (req.data.length < 50) {
      setTimeout(() => {
        dispatch(actions.patchStream({ id: stream.id, patch: { type: 'live' } }));
      }, 2);
    }
    if (saveLocation) {
      url.saveStream({
        channelId: stream.channelId,
        parentId: stream.parentId,
        ...(req.data.length < 50 ? { type: 'live' } : { type: 'archive', date }),
      });
    }
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    // TODO: handle error message
  }
};

export const loadMessagesArchive = (stream, saveLocation = false) => async (dispatch, getState) => {
  if (!stream.channelId) return;
  const { date } = stream;
  try {
    const loadingDone = loading(dispatch, getState);
    dispatch(actions.messagesClear({ stream }));
    const req2 = await client.req({
      ...stream,
      type: 'messages:load',
      before: date,
      limit: 50,
    });
    dispatch(actions.addMessages(req2.data));
    const req = await client.req({
      ...stream,
      type: 'messages:load',
      after: date,
      limit: 50,
    });
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id));
    dispatch(actions.addMessages(req.data));
    if (saveLocation) {
      url.saveStream({
        channelId: stream.channelId,
        parentId: stream.parentId,
        ...(req.data.length < 50 ? { type: 'live' } : { type: 'archive', date }),
      });
    }
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export const loadMessagesLive = (stream, saveLocation = false) => async (dispatch, getState) => {
  if (!stream.channelId) return;
  try {
    const loadingDone = loading(dispatch, getState);
    const req = await client.req({
      ...stream,
      type: 'messages:load',
      limit: 50,
    });
    if (saveLocation) {
      url.saveStream({
        type: 'live',
        channelId: stream.channelId,
        parentId: stream.parentId,
      });
    }
    dispatch(actions.addMessages(req.data));
    if (req.data?.length > 0) dispatch(updateProgress(req.data[0].id));
    loadingDone();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    // TODO: handle error message
  }
};

export const loadMessages = (stream) => async (dispatch) => {
  if (stream.type === 'archive') {
    dispatch(loadMessagesArchive(stream));
  } else {
    dispatch(loadMessagesLive(stream));
  }
};

export const addReaction = (id, text) => async (dispatch) => {
  try {
    const req = await client.req({
      type: 'reaction:send',
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
    dispatch(loadMessagesLive(stream));
  }
};

export const send = (stream, msg) => (dispatch) => dispatch(msg.type === 'command:execute' ? sendCommand(stream, msg) : sendMessage(msg));

export const sendShareMessage = (data) => async (dispatch, getState) => {
  const { channelId, parentId } = selectors.getStream('main')(getState());
  const info = { links: [] };
  const msg = build({
    type: 'message:send',
    channelId,
    parentId,
    flat: `${data.title} ${data.text} ${data.url}`,
    message: buildShareMessage(data, info),
  }, getState());
  msg.links = info.links;
  dispatch(actions.addMessage({ ...msg, pending: true }));
  try {
    await client.notif(msg);
  } catch (err) {
    dispatch(actions.addMessage({
      clientId: msg.clientId,
      channelId: msg.channelId,
      parentId: msg.parentId,
      info: {
        msg: 'Sending message failed',
        type: 'error',
        action: 'resend',
      },
    }));
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
  dispatch(actions.addMessage(notif));
  try {
    await client.notif(msg);
    dispatch(actions.addMessage({ ...notif, notifType: 'success', notif: `${msg.name} executed successfully` }));
  } catch (err) {
    dispatch(actions.addMessage({ ...notif, notifType: 'error', notif: `${msg.name} error ${err.res.message || err.message}` }));
  }
};

const sendMessage = (msg) => async (dispatch) => {
  dispatch(actions.addMessage({ ...msg, pending: true }));
  try {
    await client.notif(msg);
  } catch (err) {
    dispatch(actions.addMessage({
      clientId: msg.clientId,
      channelId: msg.channelId,
      parentId: msg.parentId,
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
  msg.userId = state.users.meId;
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
      type: 'message:send',
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
    type: 'message:send',
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
