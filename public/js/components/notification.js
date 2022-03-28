import {html} from '/js/utils.js';

export const Notification = ({children, className = [], ...props}) => html`
  <div ...${props} class=${['notification', ...className].join(' ')}>
    ${children}
  </div>
`;
