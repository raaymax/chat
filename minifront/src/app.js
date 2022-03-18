import {h,t} from '/utils.js';

const emojiPromise = (async () => {
  const res = await fetch('/assets/emoji_list.json');
  return await res.json();
})();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).then((registration) => {
    console.log('SW zarejestrowany! Scope:', registration.scope );
  });
}

const createConnection = async (handler) => {
  const connect = async () => {
    window.EMOJI = await emojiPromise;
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
          h('span', {class: 'spacy'}, [t('debug')]),
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
  
(async () => {
  window.WS = await createConnection((ws) => {
    ws.addEventListener('message', (raw)=>{
      try{
        const msg = JSON.parse(raw.data);
        console.log(msg);
        if(msg.op) {
          if(msg.op.type === 'set:session') {
            localStorage.setItem('session', JSON.stringify(msg.op.session));
          }
          if(msg.op.type === 'set:channel') {
            messages.innerHTML = '';
            WS.send(JSON.stringify({op: {type: 'load', channel: msg.op.channel}}));
          }
          return;
        }
        const m = message({class: msg.private ? ['private'] : []}, {
          author: h('span', {class: 'spacy author'}, [t(msg.user?.name || 'Guest')]),
          content: h('span', {}, buildHtmlFromMessage(msg.message)),
          date: h('span', {class: 'spacy time'}, [t(getTime(msg.createdAt))]),
        })
        messages.appendChild(m);
        messages.scrollTo(0,messages.scrollHeight);
      } catch(err) {
        console.error(err);
        console.log(raw);
      }
    });
  });

  try{
    WS.send(JSON.stringify({op: {type: 'load', channel: 'main'}}));
    const session = JSON.parse(localStorage.getItem('session'));
    console.log(session);
    if(session){
      WS.send(JSON.stringify({op: {type: 'restore', session}}));
    }
  }catch(err){
    console.error(err);
  }
})();

Quill.register("modules/emoji", QuillEmoji);
var quill = new Quill('#input', {
  theme: 'snow',
  modules: {
    toolbar: [['bold', 'italic', 'underline', 'link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['blockquote', 'code', 'code-block'], ['image'],['clean']],
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
quill.focus();

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

  const elements = data.ops
    .map(op => {
      if(op.insert === '\n'){
        return [{br:true, attributes: op.attributes}];
      }
      return Object.keys(op.attributes || {}).reduce((acc, attr) => {
        switch(attr) {
          case 'bold': return [{bold: acc}];
          case 'italic': return [{italic: acc}];
          case 'underline': return [{underline: acc}];
          case 'link': return [{link: {children: acc, href: op.attributes.link}}];
        }
      }, splitLines(op))
    }).flat();
  
  console.log('elements', JSON.stringify(elements, null, 4));

  const buf = [];
  let currentList = null;
  let current = {line: []};

  elements.forEach(element => {
    current.line.push(element);
    if(element.br) {
      const attr = element.attributes;
      if (attr && attr.list) {
          if(!currentList) currentList = {[attr.list]: []};
          if(currentList && !currentList[attr.list]) {
            buf.push(currentList);
            currentList = {[attr.list]: []};
          }
          currentList[attr.list].push({item: current.line});
      }else{
        if(currentList) {
          buf.push(currentList);
          currentList = null;
        }
        buf.push(current);
      }
      current = {line: []}
    }
  })
  if(currentList) {
    buf.push(currentList);
    currentList = null;
  }
  
  return {
    message: buf
  };
}

function splitLines(op) {
  if(typeof op.insert === 'string'){
    return separate({br: true}, op.insert.split('\n')
      //.map(l => (l !== '' ? [{text: l}] : []))
      .map(l => ({text: l}))
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
    return [msg].flat().map(part => {
      if(part.bullet) return h('ul',{}, buildHtmlFromMessage(part.bullet));
      if(part.ordered) return h('ol',{}, buildHtmlFromMessage(part.ordered));
      if(part.item) return h('li',{}, buildHtmlFromMessage(part.item));
      if(part.line) return buildHtmlFromMessage(part.line);
      if(part.text) return t(part.text);
      if(part.br) return h("br");
      if(part.bold) return h("b", {}, buildHtmlFromMessage(part.bold));
      if(part.italic) return h("em", {}, buildHtmlFromMessage(part.italic));
      if(part.underline) return h("u", {}, buildHtmlFromMessage(part.underline));
      if(part.link) return h("a", {href: part.link.href}, buildHtmlFromMessage(part.link.children));
      if(part.emoji){
        const emoji = EMOJI.find(e =>e.name == part.emoji);
        if(!emoji) return t("");
        return t(String.fromCodePoint(parseInt(emoji.unicode, 16)));
      }
      if(part.text === "") return null;
      return t("Unknown part: " + JSON.stringify(part));
    }).filter(v => v !== null).flat();
  }
}
