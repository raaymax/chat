import { useMemo } from 'react';
import { useSelector } from './useSelector';
import { Stream } from '../../types';

export const useStreamMessages = (stream: Stream) => {
  const messages = useSelector((state) => state.messages.data);
  return useMemo(
    () => messages
      .filter((m) => m.channelId === stream.channelId
    && (
      ((!stream.parentId && !m.parentId) || m.parentId === stream.parentId)
    || (!stream.parentId && m.parentId === m.id))),
    [stream, messages],
  );
};
