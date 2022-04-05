import {h} from 'preact';
import { useEffect, useRef } from '../utils.js';
import { Info } from './info.js';
import { sendFromDom } from '../services/messages.js';
// import { notifyTyping } from '../services/typing';

const notifyTyping = (e) => {
  console.log(e);
  if (e.key === 'Enter' && !e.shiftKey) {
    const input = document.getElementById('input');
    console.log('submit');
    console.log(input.textContent);
    sendFromDom(input);
    console.log(document.getSelection());
    setTimeout(() => {
      document.getElementById('scroll-stop').scrollIntoView();
    }, 1);
    //input.innerHTML = '';
    e.preventDefault();
  }
}

const selection = (e) => {
  console.log('selection', e);
    console.log(document.getSelection());
}

const wrap = tagName => (e) => {
  //document.getSelection().getRangeAt(0).surroundContents(document.createElement(tag));
  var range = window.getSelection().getRangeAt(0);
  let tag = document.createElement(tagName);
  tag.appendChild(range.extractContents());
  range.insertNode(tag);
  e.preventDefault();
}

export const Input = () => {
  const input = useRef(null);

  useEffect(() => {
    input.current.addEventListener('paste', (event) => {
      let paste = (event.clipboardData || window.clipboardData).getData('text');
      const urlCheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
      const m = paste.match(urlCheck);
      const a = paste.split(m[0]);

      console.log(m);
      console.log('paste', paste);

      const selection = window.getSelection();
      if (!selection.rangeCount) return false;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(paste));

      event.preventDefault();
    });
  }, [])


  useEffect(() => {
    document.addEventListener('selectionchange', selection);
    return () => document.removeEventListener('selectionchange', selection);
  }, []);

  useEffect(() => {
    input.current.addEventListener('keydown', notifyTyping);
    return () => input.current.removeEventListener('keydown', notifyTyping);
  }, []);

  return (
    <div class="input-container" onclick={() => {}} >
      <div class='toolbar'>
        <button onclick={wrap('b')}><i class='fa-solid fa-bold' /></button>
        <button onclick={wrap('i')}><i class='fa-solid fa-italic' /></button>
        <button onclick={wrap('u')}><i class='fa-solid fa-underline' /></button>
        <button onclick={wrap('s')}><i class='fa-solid fa-strikethrough'/></button>
      </div>
      <div id="input" contenteditable='true' ref={input} />
      <div class='actionbar'>
        <Info />
        <div class='action' onclick={() => {}}>
          <i class="fa-solid fa-paragraph" />
        </div>
        <div class='space' />
        <div class='action green' onclick={() => {}}>
          <i class="fa-solid fa-paper-plane" />
        </div>
      </div>
    </div>
  );
};
