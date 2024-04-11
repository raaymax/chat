import {
  useMemo, useEffect, useState
} from 'react';
import { useSelector, useDispatch } from '../../store';
import { loadMessages, loadNext, loadPrevious } from '../../services/messages';
import { Message } from '../../types';
import { useStream } from './useStream';
import { Stream } from '../../types';


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
