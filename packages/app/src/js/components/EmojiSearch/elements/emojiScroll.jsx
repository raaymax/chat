import styled from 'styled-components';
import PropTypes from 'prop-types';

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

export const EmojiScroll = ({ children }) => (
  <Scroll>
    <div>
      {children}
    </div>
  </Scroll>
);

EmojiScroll.propTypes = {
  children: PropTypes.any,
};
