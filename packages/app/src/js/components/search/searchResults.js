import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import { Message } from '../messages/message';
import { actions, selectors } from '../../state';
import { loadArchive } from '../../services/messages';
import { openChannel } from '../../services/channels';
import { formatTime, formatDate } from '../../utils';
import { SearchSeparator } from './searchSeparator';

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
  }, [dispatch])
  return (
    <StyledList>
      <div key='bottom' id='scroll-stop' />
      {results.map((result) => (
        <div key={`search:${result.text}`}>
          <SearchSeparator >
            <div>{formatTime(result.searchedAt)} - {formatDate(result.searchedAt)}</div>
            <div>Search results for keyword "{result.text}":</div>
          </SearchSeparator>
          {result.data.map((msg) => (
            <Message
              onClick={() => gotoMessage(msg)}
              class={msg.priv ? ['private'] : []}
              data-id={msg.id}
              client-id={msg.clientId}
              key={`search:${result.text}:${msg.id || msg.clientId}`}
              sameUser={false}
              data={msg}
            />
          )).reverse()}
        </div>
      ))}
    </StyledList>
  )
}
