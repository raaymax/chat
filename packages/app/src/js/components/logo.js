import {h} from 'preact';

export const Logo = ({onClick}) => (
  <div class='logo' onClick={onClick}>
    <img class='logo-img' src='/assets/icons/android-chrome-192x192.png' alt='logo' />
    <span class='logo-name'>Quack</span>
  </div>
)
