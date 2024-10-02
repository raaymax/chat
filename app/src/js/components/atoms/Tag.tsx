import styled from 'styled-components';

const StyledTag = styled.span`
  background-color: var(--secondary_active_mask);
  border-radius: 10px;
  padding: 2px 5px;
  margin-right: 5px;
  border: 1px solid #565856;
  font-style: normal;
  cursor: pointer;
`;

type TagProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const Tag = ({ onClick, children }: TagProps) => (
  <StyledTag className='tag' onClick={onClick}>
    {children}
  </StyledTag>
);
