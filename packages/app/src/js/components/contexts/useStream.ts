import {
  useContext
} from 'react';
import { StreamContext } from './stream';
import { Stream } from '../../types';

type SetStream = (stream: Stream | null) => void;

export const useStream = (): [Stream, SetStream] => {
  const [stream, setStream] = useContext(StreamContext);
  if (!stream) throw new Error('useStream must be used within a StreamContext');

  return [
    stream,
    setStream,
  ];
};

