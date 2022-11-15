import { emojiFuse } from '../../../services/emoji';
import { createNotifier } from '../../../utils';

const [notify, watch] = createNotifier();

const state = {
  open: false,
  container: null,
  results: [],
  selected: 0,
  coords: [0, 0],
};

export const watchState = watch;

export const getState = () => state;

export const select = (idx, e) => {
  state.selected = idx;
  onSubmit(e);
};

export const install = (element) => {
  element.addEventListener('input', onInput);
  element.addEventListener('keydown', onKeyDown);
  document.addEventListener('selectionchange', onSelection);
  return () => {
    document.removeEventListener('selectionchange', onSelection);
    element.removeEventListener('keydown', onKeyDown);
    element.removeEventListener('input', onInput);
  };
};

const onKeyDown = (e) => {
  if (!state.open && e.key === ':') return onStart(e);
  if (state.open && e.key === ':') return onEnd(e);
  if (state.open && e.key === 'Enter') return onSubmit(e);
  if (state.open && e.key === 'ArrowUp') return onUp(e);
  if (state.open && e.key === 'ArrowDown') return onDown(e);
  if (state.open && (e.key === 'Space' || e.keyCode === 32)) return onClose(e);
};

const onStart = (e) => {
  state.open = true;
  const sel = document.getSelection();
  state.container = document.createElement('span');
  state.container.setAttribute('type', 'emoji-selector');
  state.container.innerText = ':';
  sel.getRangeAt(0).insertNode(state.container);
  setCursor(state.container, 1);
  document.getElementById('input').setAttribute('submitable', false);
  notify(state);
  e.preventDefault();
  e.stopPropagation();
};

const restart = () => {
  state.open = true;
  const sel = document.getSelection();
  state.container = getNotText(sel.anchorNode);
  document.getElementById('input').setAttribute('submitable', false);
  notify(state);
};

const close = () => {
  state.open = false;
  setTimeout(() => {
    document.getElementById('input').setAttribute('submitable', true);
  }, 100);
  notify(state);
};

const onClose = (e, char = '\u00a0') => {
  const r = document.createRange();
  const node = document.createTextNode(char);
  r.setStartAfter(state.container);
  r.setEndAfter(state.container);
  r.insertNode(node);
  setCursor(node, 1);
  close();
  e.preventDefault();
  e.stopPropagation();
};

const onEnd = (e) => {
  const query = `=${state.container.textContent}:`;
  const [found] = emojiFuse.search(query, { limit: 1 });
  if (!found) {
    return onClose(e, ':');
  }
  const emoji = String.fromCodePoint(parseInt(found.item.unicode, 16));
  const node = document.createTextNode(emoji);
  state.container.replaceWith(node);
  setCursor(node, node.textContent.length);
  close();
  node.parentNode.normalize();
  notify(state);
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
};

const onSubmit = (e) => {
  if (!state.results[state.selected]) {
    return onClose(e);
  }
  const emoji = String.fromCodePoint(parseInt(state.results[state.selected].item.unicode, 16));
  const node = document.createTextNode(emoji);
  state.container.replaceWith(node);
  setCursor(node, node.textContent.length);
  close();
  node.parentNode.normalize();
  notify(state);
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
};

const onInput = () => {
  if (!state.open) return;
  const sel = document.getSelection();
  const node = sel.anchorNode;
  const offset = sel.anchorOffset;
  const text = node.textContent.slice(0, offset);
  const m = text.match(/:([a-zA-Z0-9_-]+)$/);
  if (m && m.length > 1) {
    updateResults(m[1]);
  }
};

const onSelection = (e) => {
  let ignore = false;
  const sel = document.getSelection();
  if (state.open && getNotText(sel.anchorNode)?.attributes?.type?.nodeValue !== 'emoji-selector') {
    const p = document.querySelector('.emoji-menu');
    if (!p.contains(sel.anchorNode)) {
      close();
    } else {
      ignore = true;
      e.preventDefault();
      e.stopPropagation();
    }
  }
  if (!state.open && getNotText(sel.anchorNode)?.attributes?.type?.nodeValue === 'emoji-selector') {
    restart();
  }
  if (ignore || !state.open) return;
  const box = sel.getRangeAt(0).getBoundingClientRect();
  setPos([box.bottom, box.left]);
};

const onUp = (e) => {
  state.selected = ((state.selected + 1) < state.results.length)
    ? (state.selected + 1)
    : state.selected;
  notify(state);
  e.preventDefault();
  e.stopPropagation();
};

const onDown = (e) => {
  state.selected = state.selected > 0 ? state.selected - 1 : state.selected;
  notify(state);
  e.preventDefault();
  e.stopPropagation();
};

const updateResults = (search) => {
  state.results = emojiFuse.search(search, { limit: 5 });
  state.selected = Math.min(state.results.length - 1, Math.max(0, state.selected));
  notify(state);
};

const setCursor = (node, pos) => {
  const sel = document.getSelection();
  const r = document.createRange();
  r.setStart(node, pos);
  r.setEnd(node, pos);
  sel.removeAllRanges();
  sel.addRange(r);
};

const setPos = (coords) => {
  state.coords = coords;
  notify(state);
};

const getNotText = (node) => (node.nodeName === '#text' ? node.parentNode : node);
