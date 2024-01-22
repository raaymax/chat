export const Logo = ({ onClick }) => (
  <div className='logo' onClick={onClick}>
    <img className='logo-img' src='/assets/icons/android-chrome-192x192.png' alt='logo' />
    <span className='logo-name'>Quack</span>
  </div>
);
