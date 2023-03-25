import {h} from 'preact';
import styled from 'styled-components';

export const ActionButton = styled.div`
  width: 30px;
  height: 30px;
  padding: 0 6px;
  border-radius: 100%;
  line-height: 30px;
  vertical-align: middle;

  &.green {
    background-color: #1c780c;
  }

  &:hover {
    background-color: rgba(249,249,249,0.05);
  }
  &:active {
    background-color: rgba(249,249,249,0.1);
  }
  & i {
    pointer-events: none;
  }
`;
