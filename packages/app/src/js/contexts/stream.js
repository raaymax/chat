import {
  useContext, useMemo, useEffect, useState,createContext 
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadMessages, loadNext, loadPrevious } from '../services/messages';

const Context = createContext([{}, () => ({})]);

export const StreamContext = ({ children, value }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useStream = () => {
  const [stream, setStream] = useContext(Context);

  return [
    stream,
    setStream,
  ];
};

export const useMessages = () => {
  const dispatch = useDispatch();
  const [stream] = useContext(Context);
  const messages = useSelector((state) => state.messages.data);
  const [prevStream, setPrevStream] = useState({});

  useEffect(() => {
    if (prevStream.channelId === stream.channelId
      && prevStream.parentId === stream.parentId) {
      return;
    }
    setPrevStream(stream);
    dispatch(loadMessages(stream));
    dispatch.methods.progress.loadProgress(stream);
  }, [dispatch, stream, prevStream]);

  return {
    messages: useMemo(
      () => messages
        .filter((m) => m.channelId === stream.channelId
    && (
      ((!stream.parentId && !m.parentId) || m.parentId === stream.parentId)
    || (!stream.parentId && m.parentId === m.id))),
      [stream, messages],
    ),
    next: () => dispatch(loadNext(stream)),
    prev: () => dispatch(loadPrevious(stream)),
  }
};
