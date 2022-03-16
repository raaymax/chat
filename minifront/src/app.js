if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).then((registration) => {
    console.log('SW zarejestrowany! Scope:', registration.scope );
  });
}

const createConnection = async (handler) => {
  const connect = () => {
    console.log("Connecting to ",'ws://localhost:8000/ws')
    const ws = new WebSocket('ws://localhost:8000/ws');
    handler(ws);
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if(ws.readyState === 1) {
          clearInterval(timer)
          resolve(ws);
        }
      }, 10);
    })
  }
  let conPromise = connect();

  return {
    send: async function send(msg){
      const con = await conPromise;
      if(con.readyState === 1){
        con.send(msg)
      }else {
        conPromise = connect();
        send(msg);
      }
    }
  }
}

const message = (params = {}, slots = {}) => {
  return h('div',{class: ['message', ...params.class].join(' ')}, [
    h('div', {class: 'body'}, [
      h('div', {class: 'header'}, [
        h('i', {class: 'fa-regular fa-user'}),
        slots.author,
        h('i', {class: 'fa-regular fa-clock'}),
        slots.date,
        ...(slots.debug ? [h('span', {class: 'toggle-debug'}, [
          h('i', {class: 'fa-regular fa-circle-question'}),
          h('span', {class: 'spacy'}, [document.createTextNode('debug')]),
        ])] : []),
      ]),
      h('div', {class: 'content'}, slots.content ? [slots.content] : []),
      ...(slots.debug ? [h('div', {class: 'debug', style: "display: none;"}, [slots.debug])] : []) 
    ])
  ])
}

const messages = document.querySelector('#root > .message-list')
console.log(messages);

const getTime = (raw) => {
  const date = new Date(raw);
  return `${date.getHours()}:${date.getMinutes()}`
} 
  
import {h} from '/utils.js';
import {build } from '/build.js';
(async () => {
  window.WS = await createConnection((ws) => {
    ws.addEventListener('message', (raw)=>{
      const msg = JSON.parse(raw.data);
      const m = message({class: msg.private ? ['private'] : []}, {
        author: h('span', {class: 'spacy'}, [document.createTextNode(msg.author)]),
        content: h('span', {}, buildHtmlFromMessage(msg.message)),
        date: h('span', {class: 'spacy'}, [document.createTextNode(getTime(msg.createdAt))]),
      })
      messages.appendChild(m);
      messages.scrollTo(0,messages.scrollHeight);
    });
  });
})();

Quill.register("modules/emoji", QuillEmoji);
var quill = new Quill('#input', {
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
            const msg = buildMessage(this.quill.getContents());
            console.log('msg', JSON.stringify(msg, null, 4));
            if(msg) WS.send(JSON.stringify(msg));
            this.quill.setContents([]);
          }
        }
      }
    },
  }
});


function buildMessage(data) {
  if(isEmpty(data)) {
    return;
  }
  console.log('data', JSON.stringify(data, null, 4));
  const line =  data.ops[0].insert;
  if(typeof line === 'string' && line.startsWith('/')) {
    const m = line.replace('\n', '').slice(1).split(' ');
    return {command: {name: m[0], args: m.splice(1)}}
  }
  return {
    message: data.ops
      .map(op => {
        if(op.insert === '\n'){
          return [{br:true}];
        }
        if(op.attributes?.bold){
          return [{bold: makeLines(op)}];
        }
        if(op.attributes?.italic){
          return [{italic: makeLines(op)}];
        }
        if(op.attributes?.underline){
          return [{underline: makeLines(op)}];
        }
        return makeLines(op)
      }).flat()
  };
}

function makeLines(op) {
  if(typeof op.insert === 'string'){
    return separate({br: true}, op.insert.split('\n')
      .map(l => (l !== '' ? [{text: l}] : []))
      .flat())
  }else{
    return op.insert;
  }
}

function separate(separator, arr) {
  const newArr = arr.map(item => [item, separator]).flat();
  if(newArr.length > 0) newArr.length -=1;
  return newArr;
}

function isEmpty(data) {
  return data.ops.length == 1 && data.ops[0].insert === '\n';
}

function buildHtmlFromMessage(msg) {
  if(msg){
    return msg.map(part => {
      if(part.text) return document.createTextNode(part.text);
      if(part.br) return h("br");
      if(part.bold) return h("b", {}, buildHtmlFromMessage(part.bold));
      if(part.italic) return h("em", {}, buildHtmlFromMessage(part.italic));
      if(part.underline) return h("u", {}, buildHtmlFromMessage(part.underline));
      if(part.text === "") return null;
      return document.createTextNode("Unknown part: " + JSON.stringify(part));
    }).filter(v => v !== null);
  }
}
