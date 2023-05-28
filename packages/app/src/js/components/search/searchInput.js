import { h } from 'preact';
import { useDispatch } from 'react-redux';
import {
  useCallback, useEffect, useRef,
} from 'preact/hooks';
import { StatusLine } from '../StatusLine/StatusLine';
import { search } from '../../services/search';

export const SearchInput = () => {
  const input = useRef(null);
  const dispatch = useDispatch();

  const submit = useCallback(async () => {
    if (document.getElementById('input').getAttribute('submitable') !== 'true') return;
    const text = document.getElementById('input').textContent;
    dispatch(search(text));
  }, [dispatch]);

  const onSubmit = useCallback(async (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      await submit();
      e.preventDefault();
    }
  }, [submit]);

  useEffect(() => {
    const el = input.current;
    el.addEventListener('keydown', onSubmit);
    return () => {
      el.removeEventListener('keydown', onSubmit);
    };
  }, [input, dispatch, onSubmit]);

  return (
    <div class="input-container" onclick={() => {}} >
      <div id="input" contenteditable='true' submitable='true' ref={input} />
      <div class='actionbar' onclick={() => document.getElementById('input').focus()}>
        <StatusLine />
        <div class='action green' onclick={() => submit()}>
          <i class="fa-solid fa-magnifying-glass" />
        </div>
      </div>
    </div>
  );
};
