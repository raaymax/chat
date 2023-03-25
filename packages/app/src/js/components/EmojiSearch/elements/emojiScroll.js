import { h } from 'preact';
import styled from 'styled-components';

const Scroll = styled.div`
  flex: 1 1 auto;
  overflow: scroll;
  padding: 10px;
`;

export const EmojiScroll = ({children}) => (
  <Scroll>
    <div>
      {children}
    </div>
  </Scroll>
)



