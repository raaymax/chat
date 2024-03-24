import styled from 'styled-components';

const StyledInput = styled.input`

`;

type InputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  defaultValue: string;
  className: string;
  placeholder: string;
};

export const Input = (props: InputProps) => (
  <StyledInput 
    className={props.className}
    onChange={props.onChange}
    onKeyDown={props.onKeyDown}
    placeholder={props.placeholder}
    value={props.value}
    defaultValue={props.defaultValue} />
);
