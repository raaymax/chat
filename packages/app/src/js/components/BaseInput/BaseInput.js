import { h } from 'preact';
import { useInput } from '../../contexts/conversation';
import { InputContainer } from './elements/container';

const Input = ({ children }) => {
  const {
    input, onPaste, onInput, onKeyDown, onFileChange, fileInput,
  } = useInput();

  return (
    <InputContainer>
      <div
        scope='root'
        class='input'
        ref={input}
        contenteditable='true'
        onPaste={onPaste}
        onInput={(e) => onInput(e)}
        onKeyDown={(e) => onKeyDown(e)}
      />
      {children}
      <input
        onChange={onFileChange}
        ref={fileInput}
        type="file"
        multiple
        style="height: 0; opacity: 0; width: 0; position:absolute; bottom:0; left: 0;"
      />
    </InputContainer>
  );
};

export const BaseInput = ({ children }) => (
  <Input>
    {children}
  </Input>
);
