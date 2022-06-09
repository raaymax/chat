import { getCid } from './store/channel';
import { getUser } from './store/user';
import { createCounter } from './utils';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

export const fromDom = (dom) => {
  const command = dom.textContent.trim().match(/^\/\w+( \S+)*/);
  if (command) {
    const m = dom.textContent.trim().replace('\n', '').slice(1).split(/\s+/);
    return build({
      type: 'command',
      cmd: m[0],
      args: m.splice(1),
      flat: dom.textContent,
    });
  }
  if (dom.childNodes.length === 0) return build({ type: 'message', message: [], flat: '' });

  return build({ type: 'message', message: mapNodes(dom), flat: dom.textContent });
};

export function build(msg) {
  msg.channel = getCid();
  msg.clientId = tempId();
  msg.user = getUser();
  msg.createdAt = new Date();
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
