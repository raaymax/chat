import styled from 'styled-components';

export const SideMenu = styled.div`
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  .slider {
    flex: 1 calc(100% - 50px);
    overflow-y: auto;
  }
  .bottom {
    flex: 0 50px;
    .logout {
      i {
        padding-right: 10px;
      }
      height: 50px;
      line-height: 50px;
      vertical-align: middle;
      font-size: 16px;
      padding-left: 20px;
      cursor: pointer;
      &:hover {
        background-color: ${(props) => props.theme.highlightedBackgroundColor};
      }
    }
  }
  @media (max-width : 710px) {
    flex: none;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    widht: 100vw;
    height: 100vh;
    z-index: 1000;
    background-color: #1a1d21;

    & .channel {
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
      font-size: 20px;
      & .name {
      height: 40px;
        line-height: 40px;
        vertical-align: middle;
        font-size: 20px;
      }
    }
    & .user{
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
      font-size: 20px;
      & .name {
      height: 40px;
        line-height: 40px;
        vertical-align: middle;
        font-size: 20px;
      }
    }
  }
  border-left: 1px solid ${(props) => props.theme.borderColor};
  border-right: 1px solid ${(props) => props.theme.borderColor};
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
`;
