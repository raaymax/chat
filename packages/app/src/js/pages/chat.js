/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import {useState} from 'preact/hooks';
import { render } from '../utils.js';

import { Logo } from '../components/logo';
import { Channels } from '../components/channels';
import { MessageList } from '../components/messageList.js';
import { Header } from '../components/header.js';
import { Input } from '../components/input.js';
import { EmojiSelector } from '../components/EmojiSelector/EmojiSelector';

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

const Page = () => {
  const [hide, setHide] = useState(true);
  return (
    <div class='workspace'>
      <div class={['menu', ...(hide ? ['hidden'] : [])].join(' ')}>
        <Logo />
        <Channels />
      </div>
      <div class='chat workspace-main' ondrop={drop} ondragover={dragOverHandler}>
        <Header onclick={(e) =>{
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

render(<Page />, document.getElementById('root'));
