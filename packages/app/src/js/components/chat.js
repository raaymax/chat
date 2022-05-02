/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import { MessageList } from './messageList.js';
import { Header } from './header.js';
import { Input } from './input.js';
import { EmojiSelector } from './EmojiSelector/EmojiSelector';

import {upload} from '../services/file';

const drop = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { files } = e.dataTransfer;

  for (let i = 0, file; i < files.length; i++) {
    file = files.item(i);
    await upload(file);
  }
}

function dragOverHandler(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

export const Chat = () => (
  <div class='chat workspace-main' ondrop={drop} ondragover={dragOverHandler}>
    <Header />
    <MessageList />
    <Input />
    <EmojiSelector />
  </div>
);
