import { useCallback, useState, useEffect } from 'react';
import { useActions, useDispatch } from '../../store';
import styled from 'styled-components';

import { EmojiDescriptor } from '../../types';
import { buildEmojiNode } from '../../utils';
import { getUrl } from '../../services/file';
import { InputProvider } from '../contexts/input';
import { useInput } from '../contexts/useInput';

import { StatusLine } from '../atoms/StatusLine';
import { Toolbar } from '../atoms/Toolbar';

import { Attachments } from '../molecules/Attachments';
import { EmojiSelector } from '../molecules/InputEmojiSelector';
import { ChannelSelector } from '../molecules/InputChannelSelector';
import { UserSelector } from '../molecules/InputUserSelector';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';

import { EmojiSearch } from './EmojiSearch';

export const InputContainer = styled.div`
  position: relative;
  &.edit {
  }
  &.default {
    border-top: 1px solid #565856;
  }
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
    display: flex;
    flex-direction: row;
    padding: 5px;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    height: 40px;
    margin-bottom: 5px;
    margin-right: 5px;
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
    flex: 0 0 30px;
    width: auto;
    height: 30px;
    padding: 0 6px;
    border-radius: 15px;
    line-height: 30px;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    line-break: normal;
    hyphens: none;
    
    vertical-align: middle;
    margin-left: 10px;
  }
  & .actionbar .action.green {
    background-color: #1c780c;
  }
  & .actionbar .action.green:hover {
    background-color: #2aa115;
  }
  & .actionbar .action.green:active {
    background-color: #1c780c;
  }

  & .actionbar .action:hover {
    background-color: rgba(249,249,249,0.05);
  }
  & .actionbar .action:active {
    background-color: rgba(249,249,249,0.1);
  }
  & .actionbar .action.active {
    background-color: rgba(249,249,249,0.1);
  }

  .input {
    flex: 1;
    border: 0;
    padding: 5px 30px;

    .emoji img {
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      vertical-align: bottom;
    }

    .user { 
      color: ${(props) => props.theme.mentionsColor};
    }
  }
  .input:focus-visible {
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

type InputFormProps = {
  children?: React.ReactNode,
}

export const InputForm = ({ children }: InputFormProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const {
    mode, messageId,
    input, onPaste, onInput, onKeyDown, onFileChange, fileInput,
    focus, addFile, insert, send, scope, currentText, wrapMatching,
  } = useInput();
  const dispatch = useDispatch();
  const actions = useActions();

  const onEmojiInsert = useCallback((emoji: EmojiDescriptor) => {
    insert(buildEmojiNode(emoji, getUrl));
    setShowEmojis(!showEmojis);
    focus();
  }, [showEmojis, focus, insert, setShowEmojis]);

  const ctrl = useCallback((e: KeyboardEvent) => {
    if (scope === 'root' && currentText.match(/`[^`]+$/) && e.key === '`') {
      wrapMatching(/`([^`]+)$/, 'code');
      e.preventDefault();
    }
  }, [currentText, scope, wrapMatching]);

  useEffect(() => {
    const { current } = input;
    if(!current) return;
    current.addEventListener('keydown', ctrl);
    return () => {
      current.removeEventListener('keydown', ctrl);
    };
  }, [input, ctrl]);

  return (
    <InputContainer className={mode}>
      <div
        data-scope='root'
        className='input'
        ref={input}
        contentEditable='true'
        onPaste={onPaste}
        onInput={onInput}
        onKeyDown={(e) => onKeyDown(e)}
      >{children}</div>
      <Attachments />
      <Toolbar className='controls' size={40}>
        <ButtonWithIcon icon="emojis" onClick={() => setShowEmojis(!showEmojis)} />
        <ButtonWithIcon icon="plus" onClick={addFile} />
        <StatusLine />
        <div className="separator" />
        {mode === 'edit' ? (
          <>
            <ButtonWithIcon icon="xmark" onClick={() => dispatch(actions.messages.editClose(messageId))} />
            <ButtonWithIcon icon="check" onClick={send} />
          </>
        ) : (
          <ButtonWithIcon icon="send" onClick={send} />
        )}
      </Toolbar>
      <ChannelSelector />
      <UserSelector />
      <EmojiSelector />
      {showEmojis && <EmojiSearch onSelect={onEmojiInsert} />}
      <input
        onChange={onFileChange}
        ref={fileInput}
        type="file"
        multiple
        style={{
          height: 0, opacity: 0, width: 0, position: 'absolute', bottom: 0, left: 0,
        }}
      />
    </InputContainer>
  );
};

type InputProps = {
  mode?: string;
  messageId?: string;
  children?: React.ReactNode,
};

export const Input = ({ children, ...args }: InputProps) => (
  <InputProvider {...args} >
    <InputForm>{children}</InputForm>
  </InputProvider>
);
