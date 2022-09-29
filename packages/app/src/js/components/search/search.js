/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import styled from 'styled-components';
import {SearchResults} from './searchResults';
import {SearchInput} from './searchInput';
import {Header} from './header';

const StyledSearch = styled.div`
  width: 100vw;
  height: 100vh;
  flex: 0 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #565856;
  border-right: 1px solid #565856;
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
  & .form {
    background-color: #1a1d21;
    border-bottom: 1px solid #565856;
    & input {
      height: 70px;
    }
  }
`;

export const Search = () => (
  <StyledSearch>
    <Header />
    <SearchResults />
  </StyledSearch>
)
