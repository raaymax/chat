import {h} from 'preact';
import { render } from '../utils.js';
import { Chat } from '../components/chat.js';
import { Menu } from '../components/menu.js';

const Page = () => (
  <div class='workspace'>
    <Menu />
    <Chat />
  </div>
)

render(<Page />, document.getElementById('root'));
