import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {useStream} from '../../contexts/stream';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--primary_background);
  background-color: #1a1d21;
  border-bottom: 1px solid #565856;
  height: 51px;

  & * {
    flex: 1;
    height: 50px;
    line-height: 50px;

  }

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
    & .tool {
      flex: 1;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: var(--secondary_background);
      }
    }
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

export const Header = () => {
  const input = useRef(null);
  const dispatch = useDispatch();
  const [stream] = useStream();

  const submit = useCallback(async () => {
    const text = input.current.value;
    dispatch.methods.search.find(stream.channelId, text);
  }, [dispatch, stream]);

  const onSubmit = useCallback(async (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      await submit();
      e.preventDefault();
    }
  }, [submit]);

  useEffect(() => {
    const el = input.current;
    el.addEventListener('keydown', onSubmit);
    return () => {
      el.removeEventListener('keydown', onSubmit);
    };
  }, [input, dispatch, onSubmit]);

  return (
    <StyledHeader>
      <i className='fa-solid fa-magnifying-glass' />
      <input className='search-input' placeholder='search...' ref={input} onSubmit={submit} />
      <div className='toolbar'>
        <div className='tool' onClick={() => submit()}>
          <i className="fa-solid fa-paper-plane" />
        </div>
        <div className='tool' onClick={() => dispatch.actions.view.set('search')}>
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
    </StyledHeader>
  );
};
