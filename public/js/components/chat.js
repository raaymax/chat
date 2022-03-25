
import {html} from '/js/utils.js';
import {MessageList} from '/js/components/messageList.js';
import {Header} from '/js/components/header.js';
import {Input} from '/js/components/input.js';


export const Chat = (props) => {
  return html`
    <${Header} />    
    <${MessageList} />
    <${Input} />
  `;
}

