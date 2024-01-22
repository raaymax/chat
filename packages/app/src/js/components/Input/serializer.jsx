import { createCounter } from '../../utils';

export const fromDom = (dom) => {
  const command = dom.textContent.trim().match(/^\/\w+( \S+)*/);
  if (command) {
    const m = dom.textContent.trim().replace('\n', '').slice(1).split(/\s+/);
    return {
      type: 'command:execute',
      clientId: tempId(),
      createdAt: new Date().toISOString(),
      info: null,
      name: m[0],
      args: m.splice(1),
      flat: dom.textContent,
    };
  }
  if (dom.childNodes.length === 0) {
    return {
      type: 'message:create',
      clientId: tempId(),
      createdAt: new Date().toISOString(),
      info: null,
      message: [],
      flat: '',
    };
  }
  const info = {
    links: [],
    mentions: [],
  };
  const tree = mapNodes(dom, info);

  return {
    type: 'message:create',
    clientId: tempId(),
    createdAt: new Date().toISOString(),
    info: null,
    message: trim(tree),
    emojiOnly: isEmojiOnly(tree),
    flat: flatten(tree),
    parsingErrors: info.errors,
    ...info,
  };
};

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

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);
