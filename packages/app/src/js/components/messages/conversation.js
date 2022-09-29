import { h } from 'preact';
import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loadPrevious, loadNext } from '../../services/messages';
import { actions, selectors } from '../../state';
import {messageFormatter } from './formatter';
import {MessageList } from './messageList';

export function Conversation() {
  const messages = useSelector(selectors.getMessages);
  const channel = useSelector(selectors.getCid);
  const status = useSelector(selectors.getMessagesStatus);
  const selected = useSelector(selectors.getSelectedMessage);
  const dispatch = useDispatch();
  const [lastDir, setLastDir] = useState('bottom');

  useEffect(() => {
    if (lastDir === 'top' && messages.length > 100) {
      //dispatch(actions.takeHead({channel, count: 100}));
    }
    if (lastDir === 'bottom' && messages.length > 100) {
      //dispatch(actions.takeTail({channel, count: 100}));
    }
  }, [dispatch, messages, lastDir, channel]);

  return (
    <MessageList
      formatter={messageFormatter}
      list={messages}
      status={status}
      selected={selected}
      onScrollTo={(dir) => {
        setLastDir(dir);
        if (dir === 'top') {
          dispatch(loadPrevious(channel))
        }
        if (dir === 'bottom') {
          dispatch(loadNext(channel))
        }
      }}
    />
  )
}
