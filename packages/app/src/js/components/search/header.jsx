import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {useStream} from '../../contexts/stream';
import { Toolbar } from '../../atomic/organisms/Toolbar';
import { Input } from '../../atomic/atoms/Input';

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
  const [value, setValue] = useState('');

  const submit = useCallback(async () => {
    dispatch.methods.search.find(stream.channelId, value);
  }, [dispatch, stream, value]);

  const onKeyDown= useCallback(async (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      await submit();
      e.preventDefault();
    }
  }, [submit]);

  return (
    <StyledHeader>
      <i className='fa-solid fa-magnifying-glass' />
      <Input className='search-input' placeholder='search...' onKeyDown={onKeyDown} value={value} onChange={(e)=>setValue(e.target.value)}/>

      <Toolbar className="toolbar" size={50} opts = {[
        {icon: 'fa-solid fa-paper-plane', handler: () => submit()},
        {icon: 'fa-solid fa-xmark', handler: () => dispatch.actions.view.set('search')},
      ]} />
    </StyledHeader>
  );
};
