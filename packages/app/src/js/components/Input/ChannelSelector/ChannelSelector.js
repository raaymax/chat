import { h } from 'preact';
import Fuse from 'fuse.js';
import { createNotifier } from '../../../utils';
import {TextMenu} from '../TextMenu/TextMenu';

const [notify, watch] = createNotifier();

let state = {
  open: false,
  container: null,
  options: [],
  selected: 0,
};

const setState = (args) => {
  state = {...state, ...args};
  notify(state);
}

export const watchState = watch;

export const getState = () => state;

export const select = (idx, event) => {
  setState({selected: idx});
  submit({event})
};

export const ChannelSelector = (props) => <TextMenu className="channel-menu" watch={watch} select={select} {...props} />

export const start = ({event, store}) => {
  event.preventDefault();
  event.stopPropagation();
  const span = document.createElement('span');
  span.className = 'channel';
  const text = document.createTextNode( '#' );
  span.appendChild(text);
  const sel = document.getSelection();
  span.setAttribute('type', 'channel');
  sel.getRangeAt(0).insertNode(span);
  const r = document.createRange();
  r.setStart(text, 1);
  r.setEnd(text, 1);
  sel.removeAllRanges();
  sel.addRange(r);
  setState({
    open: true,
    container: span,
    options: store.getState().channels.list.slice(0, 5).map((channel) => ({
      name: channel.name,
      id: channel.id,
      icon: channel.private ? 'fa-solid fa-lock' : 'fa-solid fa-hashtag',
    })),
  });
}

const onBackspace = ({store, event }) => {
  if (state.container.textContent.length === 1) {
    state.container.remove();
    setState({container: null});
    close();
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  updateOptions({store});
}

const updateOptions = ({store}) => {
  if (!state.open) return;
  const sel = document.getSelection();
  const node = sel.anchorNode;
  const text = node.textContent;
  const m = text.match(/#([a-zA-Z0-9_-]*)$/);
  if (m && m.length > 1) {
    const list = store.getState().channels.list.map((channel) => ({
      id: channel.id,
      name: channel.name,
      icon: channel.private ? 'fa-solid fa-lock' : 'fa-solid fa-hashtag',
    }))
    if (m[1] && !list.find((channel) => channel.name === m[1])) {
      list.unshift({name: m[1], icon: 'fa-solid fa-hashtag', id: m[1]});
    }
    if (m[1].length > 0) {
      const channels = new Fuse(list, {
        keys: ['name'],
        findAllMatches: true,
      });
      const results = channels.search(m[1], { limit: 5 }).map(({item}) => item);
      setState({options: results});
    } else {
      setState({options: list.slice(0, 5)});
    }
  }
};

const selectUp = ({event}) => {
  event.preventDefault();
  event.stopPropagation();
  setState({selected: Math.min(state.selected + 1, state.options.length - 1)});
}
const selectDown = ({event}) => {
  event.preventDefault();
  event.stopPropagation();
  setState({selected: Math.max(state.selected - 1, 0)});
}

const submit = ({event}) => {
  event.preventDefault();
  event.stopPropagation();
  const {container} = state;
  const sel = document.getSelection();
  container.textContent = `#${state.options[state.selected].name}`;
  container.setAttribute('channelId', state.options[state.selected].id);
  const fresh = document.createTextNode('\u00A0');
  const r = document.createRange();
  r.setEndAfter(container);
  r.setStartAfter(container);
  r.insertNode(fresh);
  r.setStart(fresh, 1);
  r.setEnd(fresh, 1);
  sel.removeAllRanges();
  sel.addRange(r);
};

export const handle = (args) => [
  {
    match: ({event}) => event.key === ' ' || event.key === 'Space' || event.keyCode === 32 || event.key === 'Enter',
    run: submit,
  },
  { match: ({event}) => event.key === 'ArrowUp', run: selectUp},
  { match: ({event}) => event.key === 'ArrowDown', run: selectDown},
  { match: ({event}) => event.key === 'Backspace', run: onBackspace},
  { match: ({source}) => source === 'input', run: updateOptions },
].find(({match}) => match(args))?.run(args);

const restart = () => {
  const sel = document.getSelection();
  setState({
    open: true,
    container: getNotText(sel.anchorNode),
  })
};
const close = () => {
  setState({
    open: false,
  })
};

document.addEventListener('selectionchange', (e) => {
  const sel = document.getSelection();
  if (state.open && getContainer() !== 'channel') {
    const p = document.querySelector('.channel-menu');
    if (!p.contains(sel.anchorNode)) {
      close();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  if (!state.open && getContainer() === 'channel') {
    restart();
  }
});

const getNotText = (node) => (node.nodeName === '#text' ? node.parentNode : node);
const getContainer = () => (
  getNotText(document.getSelection().anchorNode)?.attributes?.type?.nodeValue
);
