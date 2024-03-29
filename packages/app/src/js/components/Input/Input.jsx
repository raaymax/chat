import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { InputContext, useInput } from './InputContext';
import { Attachments } from '../Attachments/Attachments';
import { StatusLine } from '../StatusLine/StatusLine';
import { EmojiSearch } from '../EmojiSearch/EmojiSearch';
import { buildEmojiNode } from '../../utils';
import { getUrl } from '../../services/file';
import { EmojiSelector } from './selectors/EmojiSelector';
import { ChannelSelector } from './selectors/ChannelSelector';
import { UserSelector } from './selectors/UserSelector';
import { InputContainer } from './elements/container';
import { Toolbar } from '../../atomic/atoms/Toolbar';
import { ButtonWithIcon } from '../../atomic/molecules/ButtonWithIcon';
import PropTypes from 'prop-types';

export const InputForm = ({children }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const {
    mode, messageId,
    input, onPaste, onInput, onKeyDown, onFileChange, fileInput,
    focus, addFile, insert, send, scope, currentText, wrapMatching,
  } = useInput();
  const dispatch = useDispatch();

  const onEmojiInsert = useCallback((emoji) => {
    insert(buildEmojiNode(emoji, getUrl));
    setShowEmojis(!showEmojis);
    focus();
  }, [showEmojis, focus, insert, setShowEmojis]);

  const ctrl = useCallback((e) => {
    if (scope === 'root' && currentText.match(/`[^`]+$/) && e.key === '`') {
      wrapMatching(/`([^`]+)$/, 'code');
      e.preventDefault();
    }
  }, [currentText, scope, wrapMatching]);

  useEffect(() => {
    const { current } = input;
    current.addEventListener('keydown', ctrl);
    return () => {
      current.removeEventListener('keydown', ctrl);
    };
  }, [input, ctrl]);

  return (
    <InputContainer className={mode}>
      <div
        scope='root'
        className='input'
        ref={input}
        contentEditable='true'
        onPaste={onPaste}
        onInput={(e) => onInput(e)}
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
            <ButtonWithIcon icon="xmark" onClick={() => dispatch.actions.messages.editClose(messageId)} />
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

InputForm.propTypes = {
  children: PropTypes.any,
};

export const Input = ({ children, ...args }) => (
  <InputContext {...args} >
    <InputForm>{children}</InputForm>
  </InputContext>
);

Input.propTypes = {
  children: PropTypes.any,
};
