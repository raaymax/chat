import PropTypes from 'prop-types';

export const Notification = ({ children, className = [], ...props }) => (
  <div {...props} className={['notification', ...className].join(' ')}>
    {children}
  </div>
);

Notification.propTypes = {
  children: PropTypes.node,
  className: PropTypes.arrayOf(PropTypes.string),
};
