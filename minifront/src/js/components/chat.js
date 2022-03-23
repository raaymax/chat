
import {html} from '/js/utils.js';
import {MessageList} from '/js/components/MessageList.js';
import {Header} from '/js/components/Header.js';
import {Input} from '/js/components/Input.js';


export const Chat = (props) => {
  return html`
    <${Header} />    
    <${MessageList} />
    <${Input} />
  `;
}

