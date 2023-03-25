import { h } from 'preact';
import { useStore, useSelector } from 'react-redux';
import {
  useCallback, useEffect, useRef, useState,
} from 'preact/hooks';
import styled from 'styled-components';
import { sendFromDom } from '../../services/messages';
import * as emojis from './EmojiSelector/EmojiSelector';
import * as channels from './ChannelSelector/ChannelSelector';
import { uploadMany } from '../../services/file';
import { Info } from '../info';
import { Attachments } from '../Files/Attachments';
import { selectors } from '../../state';
import { notifyTyping } from '../../services/typing';
import { useStream } from '../streamContext';
import { EmojiSearch } from '../EmojiSearch/search';
import { getUrl } from '../../services/file';
import {InputContainer} from './elements/container';
import {ActionButton} from './elements/actionButton';

function submit({
  store, input, stream, event,
}) {
  store.dispatch(sendFromDom(stream, input));
  input.innerHTML = '';
  event.preventDefault();
  input.focus();
}

const runAction = (args ) => [
  { match: ({source}) => source === 'keyDown', run: ({store}) => store.dispatch(notifyTyping()) },
  { match: ({scope, event}) => !scope && event.key === ':', run: emojis.start },
  { match: ({scope}) => scope === 'emoji-selector', run: emojis.handle },
  { match: ({scope, event}) => !scope && event.key === '#', run: channels.start },
  { match: ({scope}) => scope === 'channel', run: channels.handle },
  {
    match: ({scope, event}) => !scope && event.key === '*',
    run: ({textBefore, parent, event}) => {
      const idx = textBefore.lastIndexOf('*');
      if (idx !== -1) {
        event.preventDefault();
        event.stopPropagation();
        const text = document.createTextNode(textBefore.slice(idx + 1));
        const b = document.createElement('b');
        const fresh = document.createTextNode( '\u200B' );
        b.appendChild(text);
        const range = document.createRange();
        range.setStart(parent, idx);
        range.setEnd(parent, textBefore.length);
        range.deleteContents();
        range.insertNode(b);
        range.setStartAfter(b);
        range.setEndAfter(b);
        range.insertNode(fresh)
        const sel = document.getSelection();
        const r = document.createRange();
        r.setStart(fresh, 1);
        r.setEnd(fresh, 1);
        sel.removeAllRanges();
        sel.addRange(r);
        // setCursor(parent, parent.textContent.length);
      }
    },
  },
  {match: ({scope, event}) => !scope && event.key === 'Enter' && event.shiftKey === false, run: submit },
  {match: ({action}) => action === 'submit', run: submit },
  {match: ({action}) => action === 'focus', run: ({input}) => input.focus() },
].filter(({match}) => match(args)).map(({run}) => run(args));

const process = (store, stream, input, event, source) => runAction({
  store,
  stream,
  event,
  input,
  source,
  action: event.target?.attributes?.action?.value,
  scope: getNotText(document.getSelection().anchorNode)?.attributes?.type?.nodeValue,
  parent: document.getSelection().anchorNode,
  textBefore: document.getSelection().anchorNode.textContent
    .slice(0, document.getSelection().anchorOffset),
})

export const Input = () => {
  const [stream] = useStream();
  const store = useStore();
  const input = useRef();
  const fileInput = useRef(null);
  const [range, setRange] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatchEvent = useCallback((source, e) => (
    process(
      store,
      stream,
      input.current,
      e,
      source,
    )
  ), [store, input, stream]);
  const filesAreReady = useSelector(selectors.filesAreReady);

  useEffect(() => {
    const inputEl = input.current;
    const range = document.createRange();
    range.setStart(inputEl, 0);
    range.setEnd(inputEl, 0);
    setRange(range);
  }, [input]);

  useEffect(() => {
    const handler = (e) => {
      const range = document.getSelection().getRangeAt(0);
      if(input.current.contains(range.commonAncestorContainer)) {
        setRange(document.getSelection().getRangeAt(0));
      }
      dispatchEvent('selectionChange', e);
    }
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, [setRange]);

  const onPaste = useCallback(async (event) => {
    const cbData = (event.clipboardData || window.clipboardData);
    if (cbData.files?.length > 0) {
      event.preventDefault();
      store.dispatch(uploadMany(cbData.files));
    }

    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();

    cbData.getData('text').split('\n').reverse().forEach((line, idx) => {
      if (idx) range.insertNode(document.createElement('br'));
      range.insertNode(document.createTextNode(line));
    });
    document.getSelection().collapseToEnd();
    event.preventDefault();
    event.stopPropagation();
  }, [store])

  const onChange = useCallback(async (e) => {
    if (e.target.files?.length > 0) {
      const { files } = e.target;
      store.dispatch(uploadMany(files));
      e.target.value = '';
    }
  }, [store]);

  const insertEmoji = useCallback(async (result) => {
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
    })();
    range.deleteContents();
    const node = document.createElement('span');
    node.className = 'emoji';
    node.setAttribute('emoji', result.shortname);
    node.setAttribute('contenteditable', false);
    node.appendChild(emoji);
    range.insertNode(node);
    range.collapse();
  }, [range, store])

  return (
    <InputContainer>
      <div
        class='input'
        ref={input}
        contenteditable='true'
        onPaste={onPaste}
        onInput={(e) => dispatchEvent('input', e)}
        onKeyDown={(e) => dispatchEvent('keyDown', e)}
      />
      <Attachments />
      <div class='actionbar' onclick={(e) => dispatchEvent('click', e)} action='focus'>
        <div class={showEmojis ? 'action active' : 'action'} onclick={() => setShowEmojis(!showEmojis)}>
          <i class="fa-solid fa-face-smile-beam"></i>
        </div>
        <div class='action' onclick={() => fileInput.current.click()}>
          <i class="fa-solid fa-plus" />
        </div>
        <Info />
        <ActionButton className={filesAreReady ? 'action green' : 'action'} onClick={(e) => filesAreReady && dispatchEvent('click', e)} action='submit'>
          <i class="fa-solid fa-paper-plane" />
        </ActionButton>
      </div>
      <input onChange={onChange} ref={fileInput} type="file" multiple style="height: 0; opacity: 0; width: 0; position:absolute; bottom:0; left: 0;" />
      <emojis.EmojiSelector input={input.current} />
      <channels.ChannelSelector input={input.current} />
      {showEmojis && <EmojiSearch onSelect={insertEmoji}/>}
    </InputContainer>
  );
};
const getNotText = (node) => (node.nodeName === '#text' ? node.parentNode : node);
