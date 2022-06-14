/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import {useState, useCallback} from 'preact/hooks';

import { Logo } from '../../components/logo';
import { Channels } from '../../components/channels';
import { MessageList } from '../../components/messageList.js';
import { Header } from '../../components/header.js';
import { Input } from '../../components/input.js';
import { EmojiSelector } from '../../components/EmojiSelector/EmojiSelector';

import {upload} from '../../services/file';

export const Chat = () => {
  const [hide, setHide] = useState(true);

  const drop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;

    for (let i = 0, file; i < files.length; i++) {
      file = files.item(i);
      await upload(file);
    }
  }, [])

  const dragOverHandler = useCallback((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, [])

  useEffect(() => {
    connectWs()
  }, [])

  return (
    <div class='workspace'>
      <div class={['menu', ...(hide ? ['hidden'] : [])].join(' ')}>
        <Logo />
        <Channels />
      </div>
      <div class='chat workspace-main' ondrop={drop} ondragover={dragOverHandler}>
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
