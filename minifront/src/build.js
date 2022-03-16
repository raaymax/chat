import {h} from '/utils.js';

export function build(data) {
  console.log(data);
  if(typeof data === 'string'){
    return [document.createTextNode(data)];
  }
  const lines = [{ops:[], attributes: []}];
  if(data.ops) {
    data.ops.forEach(op => processInsert(lines, op));
  }

  //const elements = lines.map(line => line.ops.map(op => ))
  console.log(lines);
  const elements = lines.map(l => [...l.ops.map(op => document.createTextNode(op.insert)), h("br")]).flat();
  console.log(elements);
  return {elements, debug: [
    h('pre',{}, [document.createTextNode(JSON.stringify(lines, null, 4))]),
    h('pre',{}, [document.createTextNode(JSON.stringify(data, null, 4))])
  ]};
}

function processInsert(lines, op) {
  if(op.insert === '\n' && op.attributes) {
    lines[lines.length-1].attributes = op.attributes;
    lines.push({ops: [], attributes: []});
  }else if(op.insert) {
    const l = op.insert.split('\n')
    lines[lines.length-1].ops.push({insert: l[0], attributes: op.attributes});
    l.splice(1).forEach(line => lines.push({
      ops: [{insert: line, attributes: op.attributes}]
    }))
  }
}
