import { h } from 'preact';
import { Files } from '../../Files/Files';
import { useMessageData } from './messageContext';

export const Attachments = () => {
  const {attachments} = useMessageData();
  if (!attachments) return null;

  return (
    <Files list={attachments} />
  );
}
