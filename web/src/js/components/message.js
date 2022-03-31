import { html, formatTime, formatDate } from '../utils.js';

const build = (datas) => [datas].flat().map((data) => {
  if (typeof data === 'string') return html(data);
  const key = Object.keys(data).find((f) => TYPES[f]);
  if (!key) {
    return html`Unknown part: ${JSON.stringify(data)}`;
  }
  return html`<${TYPES[key]} data=${data[key]} />`;
});

const TYPES = {
  bullet: (props) => html`<ul>${build(props.data)}</ul>`,
  ordered: (props) => html`<ol>${build(props.data)}</ol>`,
  item: (props) => html`<li>${build(props.data)}</li>`,
  codeblock: (props) => html`<pre>${build(props.data)}</pre>`,
  blockquote: (props) => html`<blockquote>${build(props.data)}</blockquote>`,
  code: (props) => html`<code>${build(props.data)}</code>`,
  line: (props) => html`${build(props.data)}<br/>`,
  text: (props) => props.data,
  bold: (props) => html`<b>${build(props.data)}</b>`,
  italic: (props) => html`<em>${build(props.data)}</em>`,
  underline: (props) => html`<u>${build(props.data)}</u>`,
  strike: (props) => html`<s>${build(props.data)}</s>`,
  link: (props) => html`<a href='${props.data.href}'>${build(props.data.children)}</a>`,
  emoji: (props) => {
    const emoji = EMOJI.find((e) => e.name === props.data);
    if (!emoji) return html(`:${props.data}:`);
    return String.fromCodePoint(parseInt(emoji.unicode, 16));
  },
};

const isToday = (date) => {
  const someDate = new Date(date);
  const today = new Date()
  return someDate.getDate() === today.getDate()
    && someDate.getMonth() === today.getMonth()
    && someDate.getFullYear() === today.getFullYear()
}

const isOnlyEmoji = (message) => message 
    && message.length === 1 
    && message[0].line
    && message[0].line.length === 1 
    && message[0].line[0].emoji;

export const Message = (props = {}) => html`
  <div ...${props} class=${['message', ...props.class].join(' ')}>
    ${!props.sameUser 
      ? html`<div class='avatar'><img src=${props.avatarUrl}/></div>`
      : html`<div class='spacy side-time'>${formatTime(props.date)}</div>`
    }
    <div class='body'>
      ${!props.sameUser && html`<div class='header'>
        <span class='author'>${props.author}</span>
        <span class='spacy time'>${formatTime(props.date)}</span>
        ${!isToday(props.date) && html`<span class='spacy time'>${formatDate(props.date)}</span>`}
      </div>`}
      <div class=${['content', ...(isOnlyEmoji(props.content) ? ['emoji'] : [])].join(' ')}>${build(props.content)}</div>
      ${props.info && html`<div class=${['info', props.info.type].join(' ')}>${props.info.msg}</div>`}
    </div>
  </div>
`;
