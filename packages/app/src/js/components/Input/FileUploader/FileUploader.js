
import { h } from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useEffect, useRef, useState,
} from 'preact/hooks';
import { Info } from '../info';
import { sendFromDom } from '../../services/messages';
import { notifyTyping } from '../../services/typing';
import { installEmojiSelector } from './EmojiSelector/EmojiSelector';
import { Attachments } from '../Files/Attachments';
import { uploadMany } from '../../services/file';
import { selectors } from '../../state';

const wrap = (tagName) => (e) => {
  const range = window.getSelection().getRangeAt(0);
  const tag = document.createElement(tagName);
  tag.appendChild(range.extractContents());
  range.insertNode(tag);
  e.preventDefault();
}

export const Input = () => {
  const input = useRef(null);
  const fileInput = useRef(null);
  const [toolbar, setToolbar] = useState(false);
  const dispatch = useDispatch();

  const filesAreReady = useSelector(selectors.filesAreReady);

  const submit = useCallback(async () => {
    if (document.getElementById('input').getAttribute('submitable') !== 'true') return;
    dispatch(sendFromDom(document.getElementById('input')));
    document.getElementById('input').innerHTML = '';
  }, [dispatch]);

  const onSubmit = useCallback(async (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      await submit();
      e.preventDefault();
    }
  }, [submit])

  const onPaste = useCallback(async (event) => {
    const cbData = (event.clipboardData || window.clipboardData);
    if (cbData.files?.length > 0) {
      event.preventDefault();
      dispatch(uploadMany(cbData.files));
      return;
    }
    const paste = cbData.getData('text');
    // eslint-disable-next-line no-useless-escape
    const urlCheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+,.~#?&//=]*)/i;
    const m = paste.match(urlCheck);

    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();
    if (m) {
      const a = paste.split(m[0]);
      range.insertNode(document.createTextNode(a[1]));
      range.insertNode((() => {
        const link = document.createElement('a');
        const [url] = m;
        link.setAttribute('href', url);
        link.textContent = url;
        return link;
      })());
      range.insertNode(document.createTextNode(a[0]));
    } else {
      range.insertNode(document.createTextNode(paste));
    }
    document.getSelection().collapseToEnd();
    event.preventDefault();
  }, [dispatch])

  const onTyping = useCallback(() => dispatch(notifyTyping()), [dispatch]);

  useEffect(() => installEmojiSelector(input.current), []);
  useEffect(() => {
    const el = input.current;
    el.addEventListener('paste', onPaste);
    el.addEventListener('keydown', onTyping);
    el.addEventListener('keydown', onSubmit);
    return () => {
      el.removeEventListener('paste', onPaste);
      el.removeEventListener('keydown', onTyping);
      el.removeEventListener('keydown', onSubmit);
    }
  }, [input, dispatch, onPaste, onSubmit, onTyping]);

  const onChange = useCallback(async (e) => {
    if (e.target.files?.length > 0) {
      const { files } = e.target;
      dispatch(uploadMany(files));
      e.target.value = '';
    }
  }, [dispatch]);
  useEffect(() => {
    const el = fileInput.current;
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, [fileInput, onChange])

  return (
    <div class="input-container" onclick={() => {}} >
      {toolbar && <div class='toolbar'>
        <button onclick={wrap('b')}><i class='fa-solid fa-bold' /></button>
        <button onclick={wrap('i')}><i class='fa-solid fa-italic' /></button>
        <button onclick={wrap('u')}><i class='fa-solid fa-underline' /></button>
        <button onclick={wrap('s')}><i class='fa-solid fa-strikethrough' /></button>
      </div>}
      <div id="input" contenteditable='true' submitable='true' ref={input} />
      <Attachments />
      <div class='actionbar' onclick={() => document.getElementById('input').focus()}>
        <Info />
        <div class='action' onclick={() => fileInput.current.click()}>
          <i class="fa-solid fa-plus" />
        </div>
        <div class='action' onclick={() => setToolbar(!toolbar)}>
          <i class="fa-solid fa-paragraph" />
        </div>
        <div class='action green' onclick={() => filesAreReady && submit()}>
          <i class="fa-solid fa-paper-plane" />
        </div>
      </div>
      <input ref={fileInput} type="file" multiple style="height: 0; opacity: 0; width: 0; position:absolute; bottom:0; left: 0;" />
    </div>
  );
};
