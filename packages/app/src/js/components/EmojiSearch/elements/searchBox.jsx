import styled from 'styled-components';
import PropTypes from 'prop-types';

const SearchBoxInput = styled.input`
  flex: 0 0 30px;
  height: 30px;
  margin: 15px 10px;
  padding: 0 15px;
  background-color: ${(props) => props.theme.searchBoxBackgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
`;

export const SearchBox = ({ onChange, value }) => (
  <SearchBoxInput
    type="text"
    onChange={onChange}
    value={value}
    placeholder="Search here..."
  />
);

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};
