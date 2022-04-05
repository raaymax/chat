import {h} from 'preact';
import { MessageList } from './messageList.js';
import { Header } from './header.js';
import { Input } from './input.js';
import { Menu } from './CommandMenu/CommandMenu';

export const Chat = () => (
  <div class='chat workspace-layout'>
    <Header />    
    <MessageList />
    <Input />
    <Menu />
  </div>
);
