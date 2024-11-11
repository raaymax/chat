import styled from 'styled-components';
import { cn, ClassNames } from '../../utils';

const SearchBoxInput = styled.input`
  flex: 0 0 30px;
  height: 32px;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0 15px;
  background-color: ${(props) => props.theme.searchBoxBackgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
`;

type SearchBoxProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  defaultValue?: string;
  className?: ClassNames;
  placeholder?: string;
}

export const SearchBox = ({
  onChange, onKeyDown, placeholder = 'Search here...', defaultValue, value, className,
}: SearchBoxProps) => (
  <SearchBoxInput
    type="text"
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={cn(className)}
    value={value}
    defaultValue={defaultValue}
    placeholder={placeholder}
  />
);
