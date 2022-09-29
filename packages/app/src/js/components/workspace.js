/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import {useState} from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components';
import { Logo } from './logo';
import { Channels } from './channels';
import { Conversation } from './messages/conversation.js';
import { Header } from './header.js';
import { Input } from './input.js';
import { EmojiSelector } from './EmojiSelector/EmojiSelector';
import { Search } from './search/search';
import { selectors, actions} from '../state';

import { uploadMany } from '../services/file';

const drop = (dispatch) => async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { files } = e.dataTransfer;
  dispatch(uploadMany(files))
}

function dragOverHandler(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

const StyledWorkspace = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledMainWorkspace = styled.div`
  flex: 1;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledMenu = styled.div`
  flex: 0 150px;
  @media (max-width : 480px) {
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
  }
  border-left: 1px solid #565856;
  border-right: 1px solid #565856;
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
`;

export const Workspace = () => {
  const view = useSelector(selectors.getView);
  const dispatch = useDispatch();
  return (
    <StyledWorkspace>
      {view === 'sidebar' && <StyledMenu>
        <Logo onClick={() => dispatch(actions.setView('sidebar'))}/>
        <Channels />
      </StyledMenu>}

      {view === 'search' && <Search />}
      {view !== 'search' && <StyledMainWorkspace ondrop={drop(dispatch)} ondragover={dragOverHandler}>
        <Header onclick={() => {
          dispatch(actions.setView('sidebar'));
        }} />
        <Conversation />
        <Input />
        <EmojiSelector />
      </StyledMainWorkspace>}
    </StyledWorkspace>
  )
}
