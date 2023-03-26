import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { useMessageData } from '../../contexts/message';
import { resend } from '../../services/messages';

export const Info = () => {
  const {clientId, info} = useMessageData();
  const dispatch = useDispatch();

  const onAction = useCallback(() => {
    if (info.action === 'resend') {
      dispatch(resend(clientId));
    }
  }, [dispatch, clientId, info]);

  if (!info) return null;
  return (
    <div onclick={onAction} class={['info', info.type, ...(info.action ? ['action'] : [])].join(' ')}>
      {info.msg}
    </div>
  )
};
