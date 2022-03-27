const KEYS = [
  'bullet',
  'ordered',
  'item',
  'codeblock',
  'blockquote',
  'code',
  'line',
  'text',
  'br',
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'emoji',
]

const flat = (datas) => {
  return [datas].flat().map(data => {
    if(typeof data === 'string') return data;

    const key = Object.keys(data).find(f => KEYS.includes(f));
    if(!key) return '';
    return type(key, data[key]);
  }).join(' ');
}


function type(t, data) {
  switch(t){
    case 'br':
      return '';
    case 'link':
      return flat(data.children);
    default:
      return flat(data);
  }
}

module.exports = {flat}
