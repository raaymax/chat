import { createContext } from 'react';
import { Stream } from '../../types';

type SetStream = (stream: Stream | null) => void;

export const StreamContext = createContext<[Stream | null, SetStream]>([null, () => ({})]);

type StreamProviderProps = {
  children: React.ReactNode;
  value: [Stream, SetStream];
};

export const StreamProvider = ({ children, value }: StreamProviderProps) => (
  <StreamContext.Provider value={value}>
    {children}
  </StreamContext.Provider>
);
