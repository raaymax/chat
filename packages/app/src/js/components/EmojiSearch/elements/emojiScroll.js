import { h } from 'preact';
import styled from 'styled-components';

const Scroll = styled.div`
  flex: 1 1 auto;
  overflow-y: scroll;
  scrollbar-width: none;
  overflow-x: hidden;
  padding: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const EmojiScroll = ({children}) => (
  <Scroll>
    <div>
      {children}
    </div>
  </Scroll>
)
