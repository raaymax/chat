import { h } from 'preact';
import { useSelector } from 'react-redux';
import { useTyping } from '../../hooks';

export const StatusLine = () => {
  const info = useSelector((state) => state.info);
  const typing = useTyping(); // FIXME: status line should work in context

  const names = (typing || []).map((u) => u.name).join(', ');

  if (info?.type) {
    return (
      <div class={['info', info.type].join(' ')}>{info.message}</div>
    );
  }

  if (names) {
    return (
      <div class='info'>{names} is typing!</div>
    );
  }

  return <div class='info' />;
};
