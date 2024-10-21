import { useSize } from "../contexts/useSize";

export const Logo = ({ onClick }: {onClick: () => void}) => (
  <div className='logo' onClick={onClick}>
    <img className='logo-img' src='/icons/android-chrome-192x192.png' alt='logo' />
    <span className='logo-name'>Quack</span>
  </div>
);

export const LogoPic = ({ onClick, size }: {onClick: () => void, size?: number}) => {
  const $size = useSize(size);
  return (
    <img className='logo-img' src='/icons/android-chrome-192x192.png' alt='logo' style={$size ? {
      width: `${$size}px`,
      height: `${$size}px`,
      lineHeight: `${$size}px`,
      fontSize: `${$size}px`,
    } : undefined}/>
  );
}
