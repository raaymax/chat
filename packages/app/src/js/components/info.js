import { h } from 'preact';
import { useSelector } from 'react-redux';
import { selectors } from '../state';
import { Typing } from './typing';

export const Info = () => {
  const info = useSelector(selectors.getInfo);

  if (info.type === null) {
    return <Typing />;
  }

  return (
    <div class={['info', info.type].join(' ')}>{info.message}</div>
  );
};
