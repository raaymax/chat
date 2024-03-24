export const Logo = ({ onClick }: {onClick: () => void}) => (
  <div className='logo' onClick={onClick}>
    <img className='logo-img' src='/icons/android-chrome-192x192.png' alt='logo' />
    <span className='logo-name'>Quack</span>
  </div>
);

