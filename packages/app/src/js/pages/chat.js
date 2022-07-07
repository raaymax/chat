/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import {useState} from 'preact/hooks';
import { useDispatch } from 'react-redux'

import { Logo } from '../components/logo';
import { Channels } from '../components/channels';
import { MessageList } from '../components/messageList.js';
import { Header } from '../components/header.js';
import { Input } from '../components/input.js';
import { EmojiSelector } from '../components/EmojiSelector/EmojiSelector';

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

export const Chat = () => {
  const [hide, setHide] = useState(true);
  const dispatch = useDispatch();
  return (
    <div class='workspace'>
      <div class={['menu', ...(hide ? ['hidden'] : [])].join(' ')}>
        <Logo />
        <Channels />
      </div>
      <div class='chat workspace-main' ondrop={drop(dispatch)} ondragover={dragOverHandler}>
        <Header onclick={(e) => {
          setHide(!hide);
          e.stopPropagation();
          e.preventDefault();
        }} />
        <MessageList />
        <Input />
        <EmojiSelector />
      </div>
    </div>
  )
}
