import { html } from '../utils.js';
import { MessageList } from './messageList.js';
import { Header } from './header.js';
import { Input } from './input.js';

export const Chat = () => html`
    <${Header} />    
    <${MessageList} />
    <${Input} />
  `;
