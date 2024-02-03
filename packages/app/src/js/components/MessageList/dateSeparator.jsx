import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledDateSeparator = styled.div`
  text-align: center;
  line-height: 30px;
  height: 50px;
  display: block;
  flex: 0;
  position: relative;
  background-color: #38393b;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const DateSeparator = ({ children }) => (
  <StyledDateSeparator>{children}</StyledDateSeparator>
);

DateSeparator.propTypes = {
  children: PropTypes.node,
};
