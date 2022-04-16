import { getChannel } from './store/channel';
import { getUser } from './store/user';
import { createCounter } from './utils';

const tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);

export const fromDom = (dom) => {
  const command = dom.textContent.match(/^\/\w+( \S+)*/);
  if (command) {
    const m = dom.textContent.replace('\n', '').slice(1).split(/\s+/);
    console.log(m);
    return build({
      command: { name: m[0], args: m.splice(1) },
      flat: dom.textContent,
    });
  }
  if (dom.childNodes.length === 0) return build({message: [], flat: ''});

  return build({message: mapNodes(dom), flat: dom.textContent});
}

export function fromQuill(data) {
  if (isEmpty(data)) {
    return;
  }
  if (data.ops.length === 1) {
    const line = data.ops[0].insert;
    if (line.indexOf('\n') === line.length - 1
      && typeof line === 'string'
      && line.startsWith('/')) {
      const m = line.replace('\n', '').slice(1).split(' ');
      return { command: { name: m[0], args: m.splice(1) } };
    }
  }

  let norm = normalize(data);
  norm = applyInline(norm);
  norm = groupLines(norm);
  norm = applyLineModifiers(norm);
  norm = applyMultilineModifiers(norm);
  return build({ message: norm, flat: flat(norm) });
}

export function build(msg) {
  msg.channel = getChannel();
  msg.clientId = tempId();
  msg.user = getUser();
  msg.createdAt = new Date();
  msg.info = null;
  return msg;
}

function applyMultilineModifiers(lines) {
  const groups = [];
  const last = () => (groups.length ? groups[groups.length - 1] : {});
  lines.forEach((line) => {
    if (!line.attributes) return groups.push(line);
    return Object.keys(line.attributes || {}).forEach((attr) => {
      attr = attr.replace(/-/g, '');
      switch (attr) {
      case 'list':
        if (last()[line.attributes[attr]]) last()[line.attributes[attr]].push(line);
        else groups.push({ [line.attributes[attr]]: [line] });
        return;
      case 'codeblock':
      case 'blockquote':
        if (last()[attr]) last()[attr].push(line);
        else groups.push({ [attr]: [line] });
        return;
      default: groups.push(line);
      }
    });
  });
  return groups;
}

function applyLineModifiers(lines) {
  return lines.map((line) => Object.keys(line.attributes || {}).reduce((acc, attr) => {
    switch (attr) {
    case 'list': return { attributes: line.attributes, item: acc.line };
    default: return acc;
    }
  }, line));
}

function applyInline(ops) {
  return ops.map((op) => {
    if (op.insert === '\n') return { attributes: op.attributes, text: op.insert };
    const { attributes, insert, ...rest } = op;
    return Object.keys(attributes || {}).reduce((acc, attr) => {
      switch (attr) {
      case 'bold': return { bold: acc };
      case 'code': return { code: acc };
      case 'italic': return { italic: acc };
      case 'strike': return { strike: acc };
      case 'underline': return { underline: acc };
      case 'link': return { link: { children: acc, href: attributes.link } };
      default: return acc;
      }
    }, { ...rest, text: insert });
  });
}

function groupLines(ops) {
  const lines = [];
  let group = { line: [] };
  ops.forEach((item) => {
    if (item.text === '\n') {
      if (item.attributes) group.attributes = item.attributes;
      lines.push(group);
      group = { line: [] };
    } else {
      group.line.push(item);
    }
  });
  if (group.length > 0) lines.push(group);
  return lines;
}

function normalize(data) {
  return data.ops.map((op) => splitLines(op)).flat();
}

function splitLines(op) {
  if (typeof op.insert === 'string') {
    return separate({ ...op, insert: '\n' }, op.insert.split('\n')
      .map((l) => ({ ...op, insert: l }))
      .flat()).filter((item) => item.insert !== '');
  }
  return op.insert;
}

function separate(separator, arr) {
  const newArr = arr.map((item) => [item, separator]).flat();
  if (newArr.length > 0) newArr.length -= 1;
  return newArr;
}

function isEmpty(data) {
  return data.ops.length === 1 && data.ops[0].insert === '\n';
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
