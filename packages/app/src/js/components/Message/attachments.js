import { h } from 'preact';
import { Files } from '../Files/Files';
import { useMessageData } from '../../contexts/message';

export const Attachments = () => {
  const {attachments} = useMessageData();
  if (!attachments) return null;

  return (
    <Files list={attachments} />
  );
}
