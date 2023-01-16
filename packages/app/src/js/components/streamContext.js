import { h, createContext } from 'preact';
import { useDispatch } from 'react-redux';
import { useContext, useState, useEffect, useCallback } from 'preact/hooks';
import { loadMessages } from '../services/messages';
import { loadProgress } from '../services/progress';

const Context = createContext([{}, () => {}]);

export const StreamContext = ({children, value}) => {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export const useStream = () => {
  const [stream, setStream] = useContext(Context);

  return [
    stream,
    setStream,
  ];
}
