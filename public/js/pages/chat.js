import {html, render} from '/js/utils.js';
import {Chat} from '/js/components/chat.js';

render(html`<${Chat}/>`, document.getElementById('root'));
