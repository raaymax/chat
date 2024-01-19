export const Notification = ({ children, className = [], ...props }) => (
  <div {...props} className={['notification', ...className].join(' ')}>
    {children}
  </div>
);
