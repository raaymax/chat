import PropTypes from 'prop-types';

export const Logo = ({ onClick }) => (
  <div className='logo' onClick={onClick}>
    <img className='logo-img' src='/assets/icons/android-chrome-192x192.png' alt='logo' />
    <span className='logo-name'>Quack</span>
  </div>
);

Logo.propTypes = {
  onClick: PropTypes.func,
};
