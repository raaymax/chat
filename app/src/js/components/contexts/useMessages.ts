import {
  useMemo, useEffect, useState,
} from 'react';
import { useSelector, useDispatch, useMethods } from '../../store';
import { loadMessages, loadNext, loadPrevious } from '../../services/messages';
import { Message, Stream } from '../../types';

export const useMessages = (stream: {channelId: string, parentId?:string } ) => {
  const dispatch = useDispatch();
  const methods = useMethods();
  const messages = useSelector((state) => state.messages.data);
  const [prevStream, setPrevStream] = useState<Partial<Stream>>({});

  useEffect(() => {
    if (prevStream.channelId === stream.channelId
      && prevStream.parentId === stream.parentId) {
      return;
    }
    setPrevStream(stream);
    dispatch(loadMessages(stream));
    dispatch(methods.progress.loadProgress(stream));
  }, [dispatch, methods, stream, prevStream]);

  return {
    messages: useMemo(
      () => messages
        .filter((m: Message) => m.channelId === stream.channelId 
                && (m.parentId === stream.parentId 
                  || (m.id && m.id === stream.parentId) 
                  || (!m.parentId && !stream.parentId))),
      [stream, messages],
    ),
    next: () => dispatch(loadNext(stream)).unwrap(),
    prev: () => dispatch(loadPrevious(stream)).unwrap(),
  };
};
