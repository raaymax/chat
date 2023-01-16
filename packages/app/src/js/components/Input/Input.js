import { h } from 'preact';
import { useStore, useSelector } from 'react-redux';
import {
  useCallback, useEffect, useRef,
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

const InputContainer = styled.div`
  border-top: 1px solid #565856;
  background-color: var(--secondary_background);
  display: flex;
  flex-direction: column;

  & .toolbar {
    display: flex;
    flex-direction: row;
  }

  & .toolbar button:first-child {
    margin-left: 30px;
  }

  & .toolbar button {
    color: var(--secondary_foreground);
    margin: 2px 0 2px 2px;
    width: 25px;
    height: 25px;
    border: 0;
    padding: 1px 3px;
    background: none;
  }

  & .toolbar button:hover {
    color: var(--primary_foreground);
    background-color: var(--primary_active_mask);
  }

  & .actionbar {
    padding: 5px;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    height: 40px;
  }

  & .info {
    flex: 1;
    line-height: 30px;
    padding: 0px 10px;
    font-weight: 300;
    vertical-align: middle;
    font-size: .8em;
  }

  .info.error{
    color: #852007;
  }

  .info.action:hover{
    --text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
  }

  & .actionbar .action {
    width: 30px;
    height: 30px;
    padding: 0 6px;
    border-radius: 100%;
    line-height: 30px;
    vertical-align: middle;
  }
  & .actionbar .action.green {
    background-color: #1c780c;
  }

  & .actionbar .action:hover {
    background-color: rgba(249,249,249,0.05);
  }
  & .actionbar .action:active {
    background-color: rgba(249,249,249,0.1);
  }

  #input {
    flex: 1;
    border: 0;
    padding: 5px 30px;

    .emoji img {
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      vertical-align: bottom;
    }
  }
  #input:focus-visible {
    outline: none;
  }

  & .ql-toolbar.ql-snow{
    border: 0;
  }

  & .ql-container.ql-snow {
    border: 0;
  }

  & .channel {
    color: #3080a0;
  }
`;

const ActionButton = styled.div`
  width: 30px;
  height: 30px;
  padding: 0 6px;
  border-radius: 100%;
  line-height: 30px;
  vertical-align: middle;

  &.green {
    background-color: #1c780c;
  }

  &:hover {
    background-color: rgba(249,249,249,0.05);
  }
  &:active {
    background-color: rgba(249,249,249,0.1);
  }
  & i {
    pointer-events: none;
  }
`;

function submit({ store, input, stream, event }) {
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
    document.addEventListener('selectionchange', (e) => dispatchEvent('selectionChange', e));
    return () => document.removeEventListener('selectionchange', (e) => dispatchEvent('selectionChange', e));
  });

  const onPaste = useCallback(async (event) => {
    const cbData = (event.clipboardData || window.clipboardData);
    if (cbData.files?.length > 0) {
      event.preventDefault();
      store.dispatch(uploadMany(cbData.files));
    }
  }, [store])

  const onChange = useCallback(async (e) => {
    if (e.target.files?.length > 0) {
      const { files } = e.target;
      store.dispatch(uploadMany(files));
      e.target.value = '';
    }
  }, [store]);

  return (
    <InputContainer>
      <div
        id="input"
        ref={input}
        contenteditable='true'
        onPaste={onPaste}
        onInput={(e) => dispatchEvent('input', e)}
        onKeyDown={(e) => dispatchEvent('keyDown', e)}
      />
      <Attachments />
      <div class='actionbar' onclick={(e) => dispatchEvent('click', e)} action='focus'>
        <Info />
        <div class='action' onclick={() => fileInput.current.click()}>
          <i class="fa-solid fa-plus" />
        </div>
        <ActionButton className={filesAreReady ? 'green' : ''} onClick={(e) => filesAreReady && dispatchEvent('click', e)} action='submit'>
          <i class="fa-solid fa-paper-plane" />
        </ActionButton>
      </div>
      <input onChange={onChange} ref={fileInput} type="file" multiple style="height: 0; opacity: 0; width: 0; position:absolute; bottom:0; left: 0;" />
      <emojis.EmojiSelector input={input.current} />
      <channels.ChannelSelector input={input.current} />
    </InputContainer>
  );
};
const getNotText = (node) => (node.nodeName === '#text' ? node.parentNode : node);
