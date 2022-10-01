import { h } from 'preact';
import styled from 'styled-components';

const StyledSearchSeparator = styled.div`
  line-height: 30px;
  height: auto;
  display: block;
  flex: 0;
  position: relative;
  background-color: #38393b;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 30px;
`;

export const SearchSeparator = ({children}) => (
  <StyledSearchSeparator>{children}</StyledSearchSeparator>
)
