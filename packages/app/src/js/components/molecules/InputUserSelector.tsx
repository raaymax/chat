import {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import Fuse from 'fuse.js';
import { TextMenu } from './TextMenu';
import { useInput } from '../contexts/useInput';
import { useUsers } from '../../store';

const SCOPE = 'user';

export const UserSelector = () => {
  const [selected, setSelected] = useState(0);
  const {
    input, currentText, scope, insert, scopeContainer,
  } = useInput();
  const users = useUsers();
  const fuse = useMemo(() => new Fuse(users, {
    keys: ['name'],
    findAllMatches: true,
    includeMatches: true,
  }), [users]);

  const options = useMemo(() => {
    let opts = fuse.search(currentText || '').slice(0, 5).map(({ item }) => item);
    opts = opts.length ? opts : users.slice(0, 5);
    opts = opts.map((user) => ({
      name: user.name,
      id: user.id,
      icon: 'fa-solid fa-user',
    }));
    return opts;
  }, [fuse, users, currentText]);

  const create = useCallback((event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const span = document.createElement('span');
    span.className = 'user-selector';
    const text = document.createTextNode('@');
    span.appendChild(text);
    span.setAttribute('data-scope', SCOPE);
    insert(span);
  }, [insert]);

  const submit = useCallback((event: Event, opts?: {selected: number}) => {
    if(!scopeContainer) return;
    event.preventDefault();
    event.stopPropagation();
    scopeContainer.className = 'user';
    scopeContainer.textContent = `@${options[opts?.selected ?? selected].name}`;
    scopeContainer.contentEditable = 'false';
    scopeContainer.setAttribute('userId', options[opts?.selected ?? selected].id);
    const fresh = document.createTextNode('\u00A0');
    const r = document.createRange();
    r.setEndAfter(scopeContainer);
    r.setStartAfter(scopeContainer);
    r.insertNode(fresh);
    r.setStart(fresh, 1);
    r.setEnd(fresh, 1);
    const sel = document.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  }, [options, selected, scopeContainer]);

  const remove = useCallback((event: Event) => {
    if(!scopeContainer) return;
    if (scopeContainer.textContent?.length === 1) {
      scopeContainer.remove();
      event.preventDefault();
      event.stopPropagation();
    }
  }, [scopeContainer]);

  const ctrl = useCallback((e: KeyboardEvent) => {
    if (scope === 'root' && currentText.match(/(^|\s)$/) && e.key === '@') {
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

  const onSelect = useCallback((idx: number, e: Event) => {
    submit(e, {selected: idx});
  },[submit]);

  useEffect(() => {
    const { current } = input;
    if (!current) return;
    current.addEventListener('keydown', ctrl);
    return () => {
      current.removeEventListener('keydown', ctrl);
    };
  }, [input, ctrl]);

  if (scope !== SCOPE) return null;

  return (
    <TextMenu open={true} options={options} onSelect={onSelect} selected={selected} setSelected={setSelected} />
  );
};
