if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).then((registration) => {
    console.log('SW zarejestrowany! Scope:', registration.scope );
  });
}

async function connectToServer(handler) {
  const ws = new WebSocket('ws://localhost:8000/ws');
  handler(ws);
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if(ws.readyState === 1) {
        console.log("connection is ready")
        clearInterval(timer)
        resolve(ws);
      }
    }, 10);
  });
}

customElements.define('c-message',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('message-template');
      const templateContent = template.content;
      this.attachShadow({mode: 'open'}).appendChild(
        templateContent.cloneNode(true)
      );
    }
  }
);

const messages = document.querySelector('#root > .message-list')
console.log(messages);

import {h} from '/utils.js';
import {build } from '/build.js';
(async () => {
  window.WS = await connectToServer((ws) => {
    ws.addEventListener('message', (raw)=>{
      console.log(raw);
      const msg = JSON.parse(raw.data);
      console.log(msg);
      const m = h('c-message', {}, [
        h('span', {slot: 'message-author'}, [document.createTextNode(msg.author)]),
        h('span', {slot: 'message-content'}, build(msg.message)),
      ]);
      messages.appendChild(m);
    });
  });
})();

Quill.register("modules/emoji", QuillEmoji);
var quill = new Quill('#input-container', {
  theme: 'snow',
  modules: {
    "emoji-toolbar": true,
    "emoji-textarea": true,
    "emoji-shortname": true,
    keyboard: {
      bindings: {
        submit: {
          key: 'enter', 
          handler: function(range, context) {
            WS.send(JSON.stringify({message: this.quill.getContents()}));
          }
        }
      }
    },
  }
});




