import {
  useContext, useMemo, useEffect, useState, createContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadMessages, loadNext, loadPrevious } from '../services/messages';
import { Message } from '../types';

type Stream = {
  id: string;
  channelId: string;
  parentId?: string;
  selected?: string;
};

type SetStream = (stream: Stream) => void;

const Context = createContext<[Stream | undefined, SetStream]>([undefined, () => ({})]);

type StreamContextProps = {
  children: React.ReactNode;
  value: [Stream, SetStream];
};

export const StreamContext = ({ children, value }: StreamContextProps) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useStream = (): [Stream, SetStream] => {
  const [stream, setStream] = useContext(Context);
  if (!stream) throw new Error('useStream must be used within a StreamContext');

  return [
    stream,
    setStream,
  ];
};

export const useMessages = () => {
  const dispatch: any = useDispatch();
  const [stream] = useStream();
  const messages = useSelector((state: any) => state.messages.data);
  const [prevStream, setPrevStream] = useState<Partial<Stream>>({});

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
        .filter((m: Message) => m.channelId === stream.channelId
    && (
      ((!stream.parentId && !m.parentId) || m.parentId === stream.parentId)
    || (!stream.parentId && m.parentId === m.id))),
      [stream, messages],
    ),
    next: () => dispatch(loadNext(stream)),
    prev: () => dispatch(loadPrevious(stream)),
  }
};
