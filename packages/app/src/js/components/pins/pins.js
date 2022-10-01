/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import {
  useState, useCallback, useEffect, useRef,
} from 'preact/hooks';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
// import {PinsList} from './pinsList';
import { actions, selectors } from '../../state';
import {Header} from './header';
import {messageFormatter } from '../messages/formatter';
import {MessageList} from '../messages/messageList';
import {loadPinnedMessages} from '../../services/pins'

const PinsList = () => [];

const StyledPins = styled.div`
  width: 100vw;
  height: 100vh;
  flex: 0 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #565856;
  border-right: 1px solid #565856;
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
  & .form {
    background-color: #1a1d21;
    border-bottom: 1px solid #565856;
    & input {
      height: 70px;
    }
  }
`;

export const Pins = () => {
  const channel = useSelector(selectors.getCid);
  const messages = useSelector(selectors.getPinnedMessages(channel));
  return (
    <StyledPins>
      <Header />
      <MessageList
        formatter={messageFormatter}
        list={messages}
        status='archive'
        onScrollTo={(dir) => {
          if (dir === 'top') {
            // dispatch(loadPrevious(channel))
          }
          if (dir === 'bottom') {
            // dispatch(loadNext(channel))
          }
        }}
      />
    </StyledPins>
  );
}
