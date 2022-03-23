import {html} from '/js/utils.js';

export function build(data) {
  if(isEmpty(data)) {
    return;
  }
  const line =  data.ops[0].insert;
  if(typeof line === 'string' && line.startsWith('/')) {
    const m = line.replace('\n', '').slice(1).split(' ');
    return {command: {name: m[0], args: m.splice(1)}}
  }

  let norm = normalize(data);
  norm = applyInline(norm);
  norm = groupLines(norm);
  norm = applyLineModifiers(norm);
  norm = applyMultilineModifiers(norm);
  return {message: norm};
}

function applyMultilineModifiers(lines) {
  const groups = [];
  const last = () => (groups.length ? groups[groups.length -1] : {});
  lines.forEach(line => {
    if(!line.attributes) return groups.push(line);
    console.log(line);
    return Object.keys(line.attributes || {}).find((attr) => {
      switch(attr) {
        case 'list':
          if(last()[line.attributes[attr]])
            last()[line.attributes[attr]].push(line);
          else groups.push({[line.attributes[attr]]: [line]});
        return;
        case 'code-block':
        case 'blockquote':
          if(last()[attr])
            last()[attr].push(line);
          else groups.push({[attr]: [line]});
        return;
        default: groups.push(line);
      }
    })
  });
  return groups;
}

function applyLineModifiers(lines) {
  return lines.map(line => {
    return Object.keys(line.attributes || {}).reduce((acc, attr) => {
      switch(attr) {
        case 'list': return {attributes: line.attributes, item: acc.line};
        default: return acc
      }
    }, line)
  })
}

function applyInline(ops){
  return ops.map(op => {
    if(op.insert === '\n') return {attributes: op.attributes, text: op.insert};
    const {attributes, insert, ...rest} = op;
    return Object.keys(attributes || {}).reduce((acc, attr) => {
      switch(attr) {
        case 'bold': return {bold: acc};
        case 'code': return {code: acc};
        case 'italic': return {italic: acc};
        case 'strike': return {strike: acc};
        case 'underline': return {underline: acc};
        case 'link': return {link: {children: acc, href: attributes.link}};
        default: return acc
      }
    }, {...rest, text: insert})
  })
}

function groupLines(ops) {
  const lines = [];
  let group = {line: []};
  ops.forEach(item => {
    if(item.text === '\n'){
      if(item.attributes) group.attributes = item.attributes;
      lines.push(group);
      group = {line: []};
    }else{
      group.line.push(item);
    }
  })
  if(group.length > 0)     lines.push(group);
  return lines;
}

function normalize(data) {
  return data.ops.map(op => splitLines(op)).flat();
}

function splitLines(op) {
  if(typeof op.insert === 'string'){
    return separate({...op, insert: '\n'}, op.insert.split('\n')
      .map(l => ({...op, insert: l}))
      .flat()).filter(item => item.insert !== '')
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
