
import {html, useEffect} from '/js/utils.js';
import {MessageList} from '/js/components/MessageList.js';
import {Header} from '/js/components/Header.js';
import {initQuill} from '/js/editor.js';


export const Chat = (props) => {
  useEffect(() => initQuill(), []);
  return html`
    <${Header} />    
    <${MessageList}  />
    <div class="input-container">
      <div id="input"></div>
    </div>     
  `;
}

