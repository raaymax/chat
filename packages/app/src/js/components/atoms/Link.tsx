import styled from 'styled-components';

const StyledLink = styled.a`
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
`;

type LinkProps = {
  children: React.ReactNode;
  href: string;
};

export const Link = ({ children, href }: LinkProps) => (
  <StyledLink href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </StyledLink>
);
