import styled from 'styled-components';

export const MainView = styled.div`
  max-width: 100vw;
  &.sidebar { 
    max-width: calc(100vw - 200px);
  }
  flex: 1 100%;
  .side-stream & {
    flex: 1 50%;
    @media (max-width : 710px) {
      flex: 0;
      width: 0vw;
      display: none;
    }
  }
`;
