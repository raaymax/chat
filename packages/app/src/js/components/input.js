import { h } from 'preact';
import { useEffect, useRef, useState } from '../utils.js';
import { Info } from './info.js';
import { sendFromDom } from '../services/messages.js';
import { notifyTyping } from '../services/typing';
import { installEmojiSelector } from './EmojiSelector/EmojiSelector';
import { Attachments } from './Files/Attachments';
import * as files from '../store/file';
import {upload} from '../services/file';

const wrap = (tagName) => (e) => {
  const range = window.getSelection().getRangeAt(0);
  const tag = document.createElement(tagName);
  tag.appendChild(range.extractContents());
  range.insertNode(tag);
  e.preventDefault();
}

const onPaste = async (event) => {
  const cbData = (event.clipboardData || window.clipboardData);
  if (cbData.files?.length > 0) {
    event.preventDefault();
    const { files } = cbData;
    for (let i = 0, file; i < files.length; i++) {
      file = files.item(i);
      await upload(file);
    }
    return;
  }
  const paste = cbData.getData('text');
  // eslint-disable-next-line no-useless-escape
  const urlCheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
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
}

const submit = async () => {
  if (document.getElementById('input').getAttribute('submitable') !== 'true') return;
  if (files.areReady()) {
    await sendFromDom(document.getElementById('input'));
    document.getElementById('input').innerHTML = '';
  }
}

const onSubmit = async (e) => {
  if (e.key === 'Enter' && e.shiftKey === false) {
    await submit();
    e.preventDefault();
  }
}

const init = (element) => {
  element.addEventListener('paste', onPaste);
  element.addEventListener('keydown', notifyTyping);
  element.addEventListener('keydown', onSubmit);
  return () => {
    element.removeEventListener('paste', onPaste);
    element.removeEventListener('keydown', notifyTyping);
    element.removeEventListener('keydown', onSubmit);
  }
}

export const Input = () => {
  const input = useRef(null);
  const [toolbar, setToolbar] = useState(false);

  useEffect(() => installEmojiSelector(input.current), []);
  useEffect(() => init(input.current), []);

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
        <div class='action' onclick={() => setToolbar(!toolbar)}>
          <i class="fa-solid fa-paragraph" />
        </div>
        <div class='action green' onclick={() => submit()}>
          <i class="fa-solid fa-paper-plane" />
        </div>
      </div>
    </div>
  );
};
