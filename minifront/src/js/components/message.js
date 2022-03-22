import {html} from '/js/utils.js';
import {formatTime} from '/js/utils.js';
import {buildHtmlFromMessage} from '/js/formatter.js';

export const Message = (props = {}) => html`
  <div ...${props} class=${['message', ...props.class].join(' ')}>
    <div class='body'>
      <div class='header'>
        <i class='fa-regular fa-user'></i>
        <span class='spacy author'>${props.author}</span>
        <i class='fa-regular fa-clock'></i>
        <span class='spacy time'>${formatTime(props.date)}</span>
      </div>
      <div class='content'>${buildHtmlFromMessage(props.content)}</div>
    </div>
  </div>
`;
