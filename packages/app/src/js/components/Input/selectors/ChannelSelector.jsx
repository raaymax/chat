import {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import Fuse from 'fuse.js';
import { TextMenu } from '../TextMenu';
import { useInput } from '../InputContext';
import { useChannels } from '../../../hooks';

const SCOPE = 'channel';

export const ChannelSelector = () => {
  const [selected, setSelected] = useState(0);
  const {
    input, currentText, scope, insert, scopeContainer,
  } = useInput();
  const channels = useChannels();
  const fuse = useMemo(() => new Fuse(channels, {
    keys: ['name'],
    findAllMatches: true,
    includeMatches: true,
  }), [channels]);

  const options = useMemo(() => {
    let opts = fuse.search(currentText || '').slice(0, 5).map(({ item }) => item);
    opts = opts.length ? opts : channels.slice(0, 5);
    opts = opts.map((channel) => ({
      name: channel.name,
      id: channel.id,
      icon: channel.private ? 'fa-solid fa-lock' : 'fa-solid fa-hashtag',
    }));
    return opts;
  }, [fuse, channels, currentText]);

  const create = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const span = document.createElement('span');
    span.className = 'channel-selector';
    const text = document.createTextNode('#');
    span.appendChild(text);
    span.setAttribute('scope', SCOPE);
    insert(span);
  }, [insert]);

  const submit = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    scopeContainer.className = 'channel';
    scopeContainer.textContent = `#${options[selected].name}`;
    scopeContainer.contentEditable = false;
    scopeContainer.setAttribute('channelId', options[selected].id);
    const fresh = document.createTextNode('\u00A0');
    const r = document.createRange();
    r.setEndAfter(scopeContainer);
    r.setStartAfter(scopeContainer);
    r.insertNode(fresh);
    r.setStart(fresh, 1);
    r.setEnd(fresh, 1);
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }, [options, selected, scopeContainer]);

  const remove = useCallback((event) => {
    if (scopeContainer.textContent.length === 1) {
      scopeContainer.remove();
      event.preventDefault();
      event.stopPropagation();
    }
  }, [scopeContainer]);

  const ctrl = useCallback((e) => {
    if (scope === 'root' && currentText.match(/(^|\s)$/) && e.key === '#') {
      create(e);
    }
    if (scope === SCOPE) {
      if (e.key === ' ' || e.key === 'Space' || e.keyCode === 32 || e.key === 'Enter') {
        submit(e);
      }
      if (e.key === 'Backspace') {
        remove(e);
      }
    }
  }, [currentText, scope, create, remove, submit]);

  useEffect(() => {
    if (!input.current) return;
    const { current } = input;
    current.addEventListener('keydown', ctrl);
    return () => {
      current.removeEventListener('keydown', ctrl);
    };
  }, [input, ctrl]);

  if (scope !== SCOPE) return null;

  return (
    <TextMenu open={true} options={options} selected={selected} setSelected={setSelected} />
  );
};
