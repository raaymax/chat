
import {html, render, useEffect} from './utils.js';
import {MessageList} from '/js/MessageList.js';
import {initQuill} from '/js/editor.js';


function App (props) {
  useEffect(() => initQuill(), []);
  return html`
    <div id="workspace-header"></div>     
    <${MessageList}  />
    <div class="input-container">
      <div id="input"></div>
    </div>     
  `;
}

render(html`<${App} name="World" />`, document.getElementById('root'));
