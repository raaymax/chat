import { h } from 'preact';
import { useSelector } from 'react-redux';
import { selectors } from '../../state';

export const StatusLine = () => {
  const info = useSelector(selectors.getInfo);
  const typing = useSelector(selectors.getTyping()); // FIXME: status line should work in context

  const names = (typing || []).map((u) => u.name).join(', ');

  if (info?.type) {
    return (
      <div class={['info', info.type].join(' ')}>{info.message}</div>
    );
  }

  if ( names ) {
    return (
      <div class='info'>{names} is typing!</div>
    );
  }

  return <div class='info' />;
};
