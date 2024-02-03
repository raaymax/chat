import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledLink = styled.a`
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
`;

export const Link = ({ children, href }) => (
  <StyledLink href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </StyledLink>
);

Link.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
};
