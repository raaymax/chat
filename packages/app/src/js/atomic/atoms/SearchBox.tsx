import styled from 'styled-components';


const SearchBoxInput = styled.input`
  flex: 0 0 30px;
  height: 30px;
  margin: 15px 10px;
  padding: 0 15px;
  background-color: ${(props) => props.theme.searchBoxBackgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
`;

type SearchBoxProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export const SearchBox = ({ onChange, onKeyDown, placeholder = "Search here...", defaultValue, value }: SearchBoxProps) => (
  <SearchBoxInput
    type="text"
    onChange={onChange}
    onKeyDown={onKeyDown}
    value={value}
    defaultValue={defaultValue}
    placeholder={placeholder}
  />
);
