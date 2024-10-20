import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { useStream } from '../contexts/useStream';
import { HoverProvider } from '../contexts/hover';
import {
  useSelector, useMethods, useDispatch,
  useActions,
  useMainStream,
} from '../../store';
import { formatTime, formatDate } from '../../utils';

import { SearchBox } from '../atoms/SearchBox';
import { Message } from '../organisms/Message';
import { Toolbar } from '../atoms/Toolbar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { Message as MessageType } from '../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useSidebar } from '../contexts/useSidebar';
import { StreamProvider } from '../contexts/stream';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #565856;
  height: 51px;


  & .channel{
    padding-left: 30px;
    vertical-align: middle;
    font-size: 20px;
    font-weight: bold;
  }
  & .channel i{
    font-size: 1.3em;
  }
  & .channel .name{
    padding-left: 10px;
  }

  & .toolbar {
    flex: 0 100px;
    display:flex;
    flex-direction: row;
  }
  i {
    flex: 0 50px;
    line-height: 50px;
    text-align: center;
    vertical-align: middle;
  }

  input{ 
    flex:1;
    margin: 3px;
    height: auto;
  }
`;

const SearchSeparator = styled.div`
  line-height: 30px;
  height: auto;
  display: block;
  flex: 0;
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 30px;
`;

const StyledList = styled.div`
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1 100%;
  overscroll-behavior: contain;
`;

const StyledSearch = styled.div`
  height: 100vh;
  flex: 0 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #565856;
  border-right: 1px solid #565856;
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
  & .form {
    background-color: #1a1d21;
    border-bottom: 1px solid #565856;
    & input {
      height: 70px;
    }
  }
`;

export const Header = () => {
  const { channelId } = useParams()!;
  const dispatch = useDispatch();
  const methods = useMethods();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  useEffect(() => {
    if(!channelId) {
      return navigate('/');
    }
  }, [channelId, navigate]);

  const submit = useCallback(async () => {
    if (!channelId) return;
    dispatch(methods.search.find({ channelId, text: value }));
  }, [methods, channelId, value, dispatch]);

  const onKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      await submit();
      e.preventDefault();
    }
  }, [submit]);

  return (
    <StyledHeader>
      <ButtonWithIcon size={50} icon="bars" onClick={toggleSidebar} />
      <i className='fa-solid fa-magnifying-glass' />
      <SearchBox className='search-input' placeholder='search...' onKeyDown={onKeyDown} value={value} onChange={(e) => setValue(e.target.value)}/>

      <Toolbar className="toolbar" size={50}>
        <ButtonWithIcon icon="send" onClick={() => submit()} />
        <ButtonWithIcon icon="xmark" onClick={() => navigate('..', {relative: 'path'})} />
      </Toolbar>
    </StyledHeader>
  );
};

export function SearchResults() {
  const navigate = useNavigate();
  const results = useSelector((state) => state.search.results);
  const gotoMessage = useCallback((msg: MessageType) => {
    navigate(`/${msg.channelId}`, {
      state: {
        type: 'archive',
        channelId: msg.channelId,
        parentId: msg.parentId,
        selected: msg.id,
        date: msg.createdAt,
      }
    });
  }, [navigate]);
  return (
    <StyledList>
      <div key='bottom' id='scroll-stop' />
      {results.map((result) => (
        <div key={`search:${result.text}`}>
          <SearchSeparator >
            <div>{formatTime(result.searchedAt)} - {formatDate(result.searchedAt)}</div>
            <div>Search results for keyword &quot;{result.text}&quot;:</div>
          </SearchSeparator>
          {result.data.map((msg: MessageType) => (
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

export const Search = () => {
  const dispatch = useDispatch();
  const actions = useActions();
  const mainStream = useMainStream();
  return (
    <StreamProvider value={[mainStream, (val) => dispatch(actions.stream.open({ id: 'main', value: val }))]}>
      <StyledSearch>
        <HoverProvider>
          <Header />
          <SearchResults />
        </HoverProvider>
      </StyledSearch>
    </StreamProvider>
  );
}
