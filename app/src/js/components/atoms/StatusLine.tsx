import { useSelector, useTyping } from '../../store';

export const StatusLine = () => {
  const info = useSelector((state) => state.info);
  const typing = useTyping(); // FIXME: status line should work in context

  const names = (typing || []).map((u) => u.name).join(', ');

  if (info?.type) {
    return (
      <div className={['info', info.type].join(' ')}>{info.message}</div>
    );
  }

  if (names) {
    return (
      <div className='info'>{names} is typing!</div>
    );
  }

  return <div className='info' />;
};
