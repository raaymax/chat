import { h } from 'preact';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--primary_background);
  background-color: #1a1d21;
  border-bottom: 1px solid #565856;
  height: 51px;

  & h1 {
    padding: 0;
    margin: 0;
    padding-left: 20px;
    width: auto;
    flex: 0;
    font-size: 30px;
    font-weight: 400;
  }

  & * {
    flex: 1;
    height: 50px;
    line-height: 50px;

  }

  & .back {
    text-align: right;
    padding-right: 10px;
  }

  & .channel{
    padding-left: 30px;
    vertical-align: middle;
    font-size: 20px;
    font-weight: bold;
  }
  & .channel i{
    font-size: 1.3em;
  }
  & .channel .name{
    padding-left: 10px;
  }
  & .toolbar {
    flex: 0 150px;
    display:flex;
    flex-direction: row-reverse;
    & .tool {
      flex: 0 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: var(--secondary_background);
      }
    }
  }
`;

