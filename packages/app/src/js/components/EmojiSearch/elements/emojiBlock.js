import {h } from 'preact';
import styled from 'styled-components';

const EmojiContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

export const EmojiBlock = ({children}) => (
  <EmojiContainer>
    {children}
  </EmojiContainer>
)
