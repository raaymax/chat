import { h } from 'preact';
import {getEmojiFuse} from '../../../services/emoji';
import { createNotifier } from '../../../utils';
import {TextMenu} from '../TextMenu/TextMenu';
import {getUrl} from '../../../services/file';

const [notify, watch] = createNotifier();

let state = {
  open: false,
  container: null,
  options: [],
  selected: 0,
  coords: [0, 0],
};

export const watchState = watch;

export const getState = () => state;

const setState = (args) => {
  state = {...state, ...args};
  notify(state);
}

export const select = (idx, e) => {
  setState({ selected: idx });
  onSubmit(e);
};

export const EmojiSelector = () => <TextMenu className="emoji-menu" watch={watch} select={select} />

export const onStart = (e) => {
  const sel = document.getSelection();
  const container = document.createElement('span');
  container.setAttribute('type', 'emoji-selector');
  container.innerText = ':';
  sel.getRangeAt(0).insertNode(container);
  setCursor(container, 1);
  setState({
    open: true,
    container,
  });
  e.preventDefault();
  e.stopPropagation();
};

export const start = ({event}) => onStart(event);
export const handle = (args) => [
  {match: ({source}) => source === 'input', run: ({event, store}) => onInput(event, store)},
  {match: ({source}) => source === 'selectionChange', run: ({event}) => onSelection(event)},
  {
    match: ({source}) => source === 'keyDown',
    run: (args) => [
      {match: ({event}) => (!state.open && event.key === ':'), run: ({event}) => onStart(event)},
      {match: ({event}) => (state.open && event.key === ':'), run: ({event, store}) => onEnd(event, store)},
      {match: ({event}) => (state.open && event.key === 'Enter'), run: ({event}) => onSubmit(event)},
      {match: ({event}) => (state.open && event.key === 'ArrowUp'), run: onUp},
      {match: ({event}) => (state.open && event.key === 'ArrowDown'), run: onDown},
      {match: ({event}) => (state.open && (event.key === 'Space' || event.keyCode === 32)), run: ({event}) => onClose(event)},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === '*'), run: ({event, store}) => endAs(event, store, 'kissing_heart')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === '/'), run: ({event, store}) => endAs(event, store, 'confused')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === ')'), run: ({event, store}) => endAs(event, store, 'slight_smile')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === 'D'), run: ({event, store}) => endAs(event, store, 'smiley')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === '('), run: ({event, store}) => endAs(event, store, 'disappointed')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':\'' && event.key === '('), run: ({event, store}) => endAs(event, store, 'cry')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === 'O'), run: ({event, store}) => endAs(event, store, 'open_mouth')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === 'P'), run: ({event, store}) => endAs(event, store, 'stuck_out_tongue')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === 'S'), run: ({event, store}) => endAs(event, store, 'confounded')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === 'X'), run: ({event, store}) => endAs(event, store, 'mask')},
      {match: ({event, textBefore}) => (state.open && textBefore === ':' && event.key === 'Z'), run: ({event, store}) => endAs(event, store, 'sleeping')},
    ].find(({match}) => match(args))?.run(args),
  },
].find(({match}) => match(args))?.run(args);

const restart = () => {
  setState({
    open: true,
    container: getNotText(document.getSelection().anchorNode),
  })
};

const close = () => {
  setState({
    open: false,
  });
};

const onClose = (e) => {
  const r = document.createRange();
  const node = document.createTextNode('\u00a0');
  r.setStartAfter(state.container);
  r.setEndAfter(state.container);
  r.insertNode(node);
  setCursor(node, 1);
  close();
  e.preventDefault();
  e.stopPropagation();
};

const onClose2 = (e, char) => {
  if (!state.container.textContent.endsWith(char)) {
    state.container.textContent += char;
  }
  state.container.className = 'emoji';
  state.container.setAttribute('emoji', state.container.textContent);
  moveOut();
  e.preventDefault();
  e.stopPropagation();
};

const moveOut = () => {
  const r = document.createRange();
  const node = document.createTextNode('\u200B');
  r.setStartAfter(state.container);
  r.setEndAfter(state.container);
  r.insertNode(node);
  setCursor(node, 1);
  close();
}

const endAs = (e, store, name) => {
  const emojiFuse = getEmojiFuse(store);
  const query = `=:${name}:`;
  const [found] = emojiFuse.search(query, { limit: 1 });
  if (!found) {
    return;
  }
  return applyResult(found.item, e);
};

const onEnd = (e, store) => {
  const emojiFuse = getEmojiFuse(store);
  const query = `=${state.container.textContent}:`;
  const [found] = emojiFuse.search(query, { limit: 1 });
  if (!found) {
    return onClose2(e, ':');
  }
  return applyResult(found.item, e);
};

const onSubmit = (e) => {
  if (!state.options[state.selected]) {
    return onClose(e);
  }
  return applyResult(state.options[state.selected], e);
};

const applyResult = (result, event) => {
  const emoji = (() => {
    if (result.unicode) {
      return document.createTextNode(String.fromCodePoint(parseInt(result.unicode, 16)));
    }
    if (result.fileId) {
      const img = document.createElement('img');
      img.src = getUrl(result.fileId);
      img.alt = result.shortname;
      return img;
    }
  })()
  const node = document.createElement('span');
  node.className = 'emoji';
  node.setAttribute('emoji', result.shortname);
  node.setAttribute('contenteditable', false);
  node.appendChild(emoji);
  state.container.replaceWith(node);
  state.container = node;
  setCursor(node, node.textContent.length - 1);
  node.parentNode.normalize();
  moveOut();
  setState({})
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export const onInput = (event, store) => {
  if (!state.open) return;
  const sel = document.getSelection();
  const node = sel.anchorNode;
  const offset = sel.anchorOffset;
  const text = node.textContent.slice(0, offset);
  const m = text.match(/:([a-zA-Z0-9_-]+)$/);
  if (m && m.length > 1) {
    updateResults(m[1], store);
  }
};

export const onSelection = (e) => {
  const sel = document.getSelection();
  if (state.open && getNotText(sel.anchorNode)?.attributes?.type?.nodeValue !== 'emoji-selector') {
    const p = document.querySelector('.emoji-menu');
    if (!p.contains(sel.anchorNode)) {
      close();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  if (!state.open && getNotText(sel.anchorNode)?.attributes?.type?.nodeValue === 'emoji-selector') {
    restart();
  }
};

const onUp = ({event}) => {
  event.preventDefault();
  event.stopPropagation();
  setState({selected: Math.min(state.selected + 1, state.options.length - 1)});
}
const onDown = ({event}) => {
  event.preventDefault();
  event.stopPropagation();
  setState({selected: Math.max(state.selected - 1, 0)});
}

const updateResults = (search, store) => {
  const emojiFuse = getEmojiFuse(store);
  const results = emojiFuse.search(search, { limit: 5 });
  setState({
    options: results.map(({item}) => ({
      ...item,
      label: item.unicode && String.fromCodePoint(parseInt(item.unicode, 16)),
      url: item.fileId && getUrl(item.fileId),
      name: item.shortname,
    })),
    selected: Math.min(results.length - 1, Math.max(0, state.selected)),
  });
};

const setCursor = (node, pos) => {
  const normPos = Math.max(pos, 0);
  const sel = document.getSelection();
  const r = document.createRange();
  r.setStart(node, normPos);
  r.setEnd(node, normPos);
  sel.removeAllRanges();
  sel.addRange(r);
};

const getNotText = (node) => (node.nodeName === '#text' ? node.parentNode : node);

document.addEventListener('selectionchange', onSelection);
