import {html} from '/js/utils.js';

export function buildMessage(data) {
  console.log(data);
  if(isEmpty(data)) {
    return;
  }
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
          case 'code': return [{code: acc}];
          case 'italic': return [{italic: acc}];
          case 'underline': return [{underline: acc}];
          case 'link': return [{link: {children: acc, href: op.attributes.link}}];
        }
      }, splitLines(op))
    }).flat();
  

  const buf = [];
  let currentList = null;
  let currentQuote = null;
  let currentCodeBlock = null;
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
      }else if (attr && attr.blockquote) {
          if(!currentQuote) currentQuote = {blockquote: []};
          currentQuote.blockquote.push(current);
      }else if (attr && attr['code-block']) {
          if(!currentCodeBlock) currentCodeBlock = {codeblock: []};
          currentCodeBlock.codeblock.push(current);
      }else{
        if(currentList) {
          buf.push(currentList);
          currentList = null;
        }
        if(currentQuote) {
          buf.push(currentQuote);
          currentQuote = null;
        }
        if(currentCodeBlock) {
          buf.push(currentCodeBlock);
          currentCodeBlock = null;
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
  if(currentQuote) {
    buf.push(currentQuote);
    currentQuote = null;
  }
  
  if(currentCodeBlock) {
    buf.push(currentCodeBlock);
    currentCodeBlock = null;
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
