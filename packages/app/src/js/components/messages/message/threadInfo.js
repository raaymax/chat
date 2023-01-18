import { h } from 'preact';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { UserCircle } from './userCircle';
import { formatTime, formatDateDetailed } from '../../../utils';
import { useMessageData } from './messageContext';
import { useStream } from '../../streamContext';
import { setStream } from '../../../services/stream';

const Container = styled.div`
  width: auto;
  display: inline-block;
  padding: 1px 11px;
  span {
    padding-left: 5px;
  }

  .replies {
    color: ${(props) => props.theme.linkColor};
  }
  .date {
    font-size: 0.7em;
    font-weight: 300;
  }
  cursor: pointer;
  &:hover {
    padding: 0px 10px;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 4px;
    background-color: ${(props) => props.theme.frontHoverColor};
  }
`;

const Link = styled.span`
  color: ${(props) => props.theme.linkColor};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const ThreadLink = ({channelId, parentId, text}) => {
  const dispatch = useDispatch();
  return (
    <Link onClick={() => dispatch(setStream('side', {type: 'live', channelId, parentId }))}>
      {text || 'Thread'}
    </Link>
  );
}

export const ThreadInfo = () => {
  const {
    updatedAt, thread, channelId, id,
  } = useMessageData();
  const dispatch = useDispatch();
  const [stream] = useStream();
  if (!thread || stream.parentId) return null;
  return (
    <Container onClick={() => dispatch(setStream('side', {type: 'live', channelId, parentId: id}))}>
      {[...new Set(thread.map((t) => t.userId))]
        .map((userId) => (
          <UserCircle key={userId} userId={userId} />
        ))}
      <span className='replies'>
        {thread.length} {thread.length > 1 ? 'replies' : 'reply'}
      </span>
      <span className='date'>
        {formatTime(updatedAt)} on {formatDateDetailed(updatedAt)}
      </span>
    </Container>
  );
};
