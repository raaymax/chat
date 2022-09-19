import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Message } from '../message';
import { selectors } from '../../state';
import { gotoMessage } from '../../services/messages';

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
  const messages = useSelector(selectors.getSearchResults);
  const dispatch = useDispatch();

  return (
    <StyledList>
      <div key='bottom' id='scroll-stop' />
      {messages.map((msg) => (
        <Message
          onClick={() => dispatch(gotoMessage(msg.id))}
          class={msg.priv ? ['private'] : []}
          data-id={msg.id}
          client-id={msg.clientId}
          key={msg.id || msg.clientId}
          sameUser={false}
          data={msg}
        />
      )).reverse()}
    </StyledList>
  )
}
