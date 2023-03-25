import {h } from 'preact';
import styled from 'styled-components';

export const EmojiSearchContainer = styled.div`
  position: absolute;
  user-select: none;
  display: flex;
  flex-direction: column;
  bottom: 100px;
  right: 10px;
  width: 400px;
  height: 500px;
  z-index: 100;
  border-radius: 10px;
  padding-bottom: 10px;
  background-color: ${props => props.theme.backgroundColor};
  border: 1px solid ${props => props.theme.borderColor};
  
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  * {
    user-select: none;
  }
`;
