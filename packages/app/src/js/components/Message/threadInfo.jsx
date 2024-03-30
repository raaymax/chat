import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { UserCircle } from '../UserCircle/UserCircle';
import { formatTime, formatDateDetailed } from '../../utils';
import { useMessageData } from '../../contexts/message';
import { useStream } from '../../contexts/stream';

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

export const ThreadInfo = () => {
  const {
    updatedAt, thread, channelId, id,
  } = useMessageData();
  const dispatch = useDispatch();
  const [stream] = useStream();
  if (!thread || stream.parentId) return null;
  return (
    <Container onClick={() => dispatch.actions.stream.open({id: 'side', value: { type: 'live', channelId, parentId: id }})}>
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
