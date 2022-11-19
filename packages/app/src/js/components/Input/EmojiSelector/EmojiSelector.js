import { h } from 'preact';
import { emojiFuse } from '../../../services/emoji';
import { createNotifier } from '../../../utils';
import {TextMenu} from '../TextMenu/TextMenu';

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
  {match: ({source}) => source === 'input', run: ({event}) => onInput(event)},
  {match: ({source}) => source === 'selectionChange', run: ({event}) => onSelection(event)},
  {
    match: ({source}) => source === 'keyDown',
    run: (args) => [
      {match: ({event}) => (!state.open && event.key === ':'), run: ({event}) => onStart(event)},
      {match: ({event}) => (state.open && event.key === ':'), run: ({event}) => onEnd(event)},
      {match: ({event}) => (state.open && event.key === 'Enter'), run: ({event}) => onSubmit(event)},
      {match: ({event}) => (state.open && event.key === 'ArrowUp'), run: onUp},
      {match: ({event}) => (state.open && event.key === 'ArrowDown'), run: onDown},
      {match: ({event}) => (state.open && (event.key === 'Space' || event.keyCode === 32)), run: ({event}) => onClose(event)},
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
  const node = document.createTextNode('\u00a0');
  r.setStartAfter(state.container);
  r.setEndAfter(state.container);
  r.insertNode(node);
  setCursor(node, 1);
  close();
}

const onEnd = (e) => {
  console.log('end');
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
  const emoji = String.fromCodePoint(parseInt(result.unicode, 16));
  const node = document.createElement('span');
  node.className = 'emoji';
  node.setAttribute('emoji', result.shortname);
  node.setAttribute('contenteditable', false);
  node.innerText = emoji;
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

export const onInput = () => {
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

const updateResults = (search) => {
  const results = emojiFuse.search(search, { limit: 5 });
  setState({
    options: results.map(({item}) => ({
      ...item,
      label: String.fromCodePoint(parseInt(item.unicode, 16)),
      name: item.shortname,
    })),
    selected: Math.min(results.length - 1, Math.max(0, state.selected)),
  });
};

const setCursor = (node, pos) => {
  const sel = document.getSelection();
  const r = document.createRange();
  r.setStart(node, pos);
  r.setEnd(node, pos);
  sel.removeAllRanges();
  sel.addRange(r);
};

const getNotText = (node) => (node.nodeName === '#text' ? node.parentNode : node);

document.addEventListener('selectionchange', onSelection);
