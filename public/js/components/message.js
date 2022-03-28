import {html} from '/js/utils.js';
import {formatTime} from '/js/utils.js';

const build = (datas) => {
  return [datas].flat().map(data => {
    if(typeof data === 'string') return html(data);
    const key = Object.keys(data).find(f => TYPES[f]);
    if(!key){
        return html`Unknown part: ${JSON.stringify(data)}`;
    }
    return html`<${TYPES[key]} data=${data[key]} />`
  });
}

const TYPES = {
  bullet: (props) => html`<ul>${build(props.data)}</ul>`,
  ordered: (props) => html`<ol>${build(props.data)}</ol>`,
  item: (props) => html`<li>${build(props.data)}</li>`,
  codeblock: (props) => html`<pre>${build(props.data)}</pre>`,
  blockquote: (props) => html`<blockquote>${build(props.data)}</blockquote>`,
  code: (props) => html`<code>${build(props.data)}</code>`,
  line: (props) => build(props.data),
  text: props => props.data,
  br: () => html`<br />`,
  bold: (props) => html`<b>${build(props.data)}</b>`,
  italic: (props) => html`<em>${build(props.data)}</em>`,
  underline: (props) => html`<u>${build(props.data)}</u>`,
  strike: (props) => html`<s>${build(props.data)}</s>`,
  link: (props) => html`<a href='${props.data.href}'>${build(props.data.children)}</a>`,
  emoji: (props) => {
    const emoji = EMOJI.find(e =>e.name == props.data);
    if(!emoji) return html(':'+ props.data+ ':');
    return String.fromCodePoint(parseInt(emoji.unicode, 16));
  },
}

export const Message = (props = {}) => html`
  <div ...${props} class=${['message', ...props.class].join(' ')}>
    <div class='body'>
      <div class='header'>
        <i class='fa-regular fa-user'></i>
        <span class='spacy author'>${props.author}</span>
        <span class='spacy time'>${formatTime(props.date)}</span>
      </div>
      <div class='content'>${build(props.content)}</div>
      ${props.info && html`<div class=${['info', props.info.type].join(' ')}>${props.info.msg}</div>`}
    </div>
  </div>
`;
