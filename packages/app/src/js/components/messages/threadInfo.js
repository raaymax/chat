import { h } from 'preact';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { UserCircle } from './userCircle';
import { formatTime, formatDateDetailed } from '../../utils';
import { openThread } from '../../services/threads';

const Container = styled.div`
  width: auto;
  display: inline-block;
  padding: 1px 11px;
  span {
    padding-left: 5px;
  }

  .replies {
    color: ${props => props.theme.linkColor};
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
    <Link onClick={() => dispatch(openThread({ channelId, parentId }))}>
      {text || 'Thread'}
    </Link>
  );
}

export const ThreadInfo = ({
  message: {
    updatedAt, thread, channelId, id,
  },
}) => {
  const dispatch = useDispatch();
  return (
    <Container onClick={() => dispatch(openThread({channelId, parentId: id}))}>
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
