import {html} from '/js/utils.js';

export const Message = (props = {}, slots = {}) => html`
  <div ...${props} class=${['message', ...props.class].join(' ')}>
    <div class='body'>
      <div class='header'>
        <i class='fa-regular fa-user'></i>
        <span class='spacy author'>${slots.author}</span>
        <i class='fa-regular fa-clock'></i>
        <span class='spacy time'>${slots.date}</span>
      </div>
      <div class='content'>${slots.content}</div>
    </div>
  </div>
`;
