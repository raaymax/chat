import { h } from 'preact';

export const Notification = ({ children, className = [], ...props }) => (
  <div {...props} class={['notification', ...className].join(' ')}>
    {children}
  </div>
);
