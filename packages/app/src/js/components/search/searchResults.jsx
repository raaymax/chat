import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Message } from '../Message/message';
import { formatTime, formatDate } from '../../utils';
import { SearchSeparator } from './searchSeparator';
import { useStream } from '../../contexts/stream';

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
  const [, setStream] = useStream();
  const results = useSelector((state) => state.search.results);
  const dispatch = useDispatch();
  const gotoMessage = useCallback((msg) => {
    dispatch.actions.view.set('search');
    setStream({
      type: 'archive',
      channelId: msg.channelId,
      parentId: msg.parentId,
      selected: msg.id,
      date: msg.createdAt,
    });
  }, [dispatch, setStream]);
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
              className={msg.priv ? ['private'] : []}
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
  );
}
