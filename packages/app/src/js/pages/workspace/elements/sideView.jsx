import styled from 'styled-components';

export const SideView = styled.div`
  flex: 0;
  .side-stream & {
    flex: 1 50%;
    @media (max-width : 710px) {
      flex: 1 100%;
    }
  }
`;
