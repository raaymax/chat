import { html, render } from '../utils.js';
import { Chat } from '../components/chat.js';

render(html`<${Chat}/>`, document.getElementById('root'));
