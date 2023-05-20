import { h, createContext } from 'preact';
import { useContext, useEffect, useState, useCallback } from 'preact/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStream } from './stream';
import { client } from '../core';
import { db } from '../db/db';
import useAutoPageLoader from '../selectors/useAutoPageLoader';
import useStreamPage from '../selectors/useStreamPage'
import {useLatestMessage} from '../selectors/useLatestMessage';

const Context = createContext({
  data: {},
});

const PAGE_SIZE = 50;

const addMessages = (res) => db.messages
  .bulkPut(res.data.map((m) => ({...m, parentId: m.parentId ? m.parentId : ''})));

export const MessagesContext = ({ children }) => {
  const [stream] = useStream();
  const [date, setDate] = useState(Date.now());
  const [streamIdx, setStreamIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const res = useLatestMessage(stream);
  useAutoPageLoader(stream, date, loaded);
  useEffect(() => {
    if (!res) return;
    setPage(0);
    addMessages(res);
    setLoaded(true);
  }, [res]);
  const messages = useStreamPage(stream, page);

  const api = {
    streamIdx,
    date,
    setDate: (val) => {
      if (!loaded) return;
      if (!val || date === val ) return;
      setDate(val);
    },
    setStreamIdx: (idx) => {
      if (!loaded) return;
      if (!idx) return;
      setPage(Math.floor(idx / PAGE_SIZE));
      setStreamIdx(idx);
    },
    messages: loaded ? messages : [],
    stream,
  }
  return (
    <Context.Provider value={api}>
      {children}
    </Context.Provider>
  );
};

export const useMessages = () => useContext(Context);
export const useStreamIdx = () => useContext(Context).streamIdx;
