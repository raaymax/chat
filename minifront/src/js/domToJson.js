

export function toJSON(dom) {
  return [...dom.childNodes].reduce((acc, node) => [
    ...acc, 
    {
      tag: node.tagName, 
      name: node.nodeName,
      value: node.nodeValue,
      attributes: node.attributes && [...node.attributes]
        .reduce((acc, a)=>({...acc, [a.nodeName]: a.nodeValue}), {}),
      children: toJSON(node)
    }
  ], [])
}


