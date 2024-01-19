import styled from 'styled-components';

export const Loader = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
  margin:7px auto;
  position: relative;
  color: #FFF;
  box-sizing: border-box;
  animation: animloader 1s linear infinite alternate;

  @keyframes animloader {
    0% {
      box-shadow: -19px -6px ,  -7px 0,  7px 0, 19px 0;
    }
    33% {
      box-shadow: -19px 0px, -7px -6px,  7px 0, 19px 0;
    }
    66% {
      box-shadow: -19px 0px , -7px 0, 7px -6px, 19px 0;
    }
    100% {
      box-shadow: -19px 0 , -7px 0, 7px 0 , 19px -6px;
    }
  }
`;
