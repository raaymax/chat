import {
  cn, ClassNames, formatTime, formatDateDetailed, isToday
} from '../../utils';

export const MessageHeader = ({ user, createdAt, sameUser }: MessageHeaderProps) => {
  return (
    <div className='header'>
      <span className='author'>{user?.name || 'Unknown'}</span>
      <span className='spacy time'>{formatTime(createdAt)}</span>
      {!isToday(createdAt) && <span className='spacy time'>{formatDateDetailed(createdAt)}</span>}
    </div>
  );
}
