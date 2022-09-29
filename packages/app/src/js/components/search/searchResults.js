import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import { Message } from '../messages/message';
import { Notification} from '../messages/notification';
import { actions, selectors } from '../../state';
import { loadArchive } from '../../services/messages';
import { openChannel } from '../../services/channels';
import { formatTime, formatDate } from '../../utils';

const StyledList = styled.div`
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  background-color: var(--primary_background);
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1 100%;
  overscroll-behavior: contain;
`;

export function SearchResults() {
  const results = useSelector(selectors.getSearchResults);
  const dispatch = useDispatch();
  const gotoMessage = useCallback((msg) => {
    dispatch(actions.setView('search'));
    dispatch(openChannel({cid: msg.channel}));
    dispatch(loadArchive({channel: msg.channel, id: msg.id, date: msg.createdAt}));
  })
  console.log(results.map(r=>r.text));
  return (
    <StyledList>
      <div key='bottom' id='scroll-stop' />
      {results.map((result) => (
        <div>
          <Notification
            key={'searchtime:'+result.text}
            className='info'>
            {formatTime(result.searchedAt)} - {formatDate(result.searchedAt)}
          </Notification>
          <Notification
            key={'search:'+result.text}
            className='info'>
            Search results for keyword "{result.text}":
          </Notification>
        {result.data.map(msg  => (
          <Message
            onClick={() => gotoMessage(msg)}
            class={msg.priv ? ['private'] : []}
            data-id={msg.id}
            client-id={msg.clientId}
            key={msg.id || msg.clientId}
            sameUser={false}
            data={msg}
          />
        )).reverse()}
        </div>
      ))}
    </StyledList>
  )
}
