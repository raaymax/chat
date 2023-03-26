import styled from 'styled-components';

export const Label = styled.div`
  width: 100%;
  color: gray;
  font-size: 12px;
  padding: 10px;

  color: ${(props) => props.theme.labelColor};
`;
