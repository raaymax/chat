import { h, createContext } from 'preact';
import { useContext, useEffect, useState, useCallback } from 'preact/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStream } from './stream';
import { client } from '../core';
import { db } from '../db/db';
import usePageLoader from '../selectors/usePageLoader';
import useStreamPage from '../selectors/useStreamPage'

const Context = createContext({
  data: {},
});

const PAGE_SIZE = 50;

const load = async (stream) => {
  if (!stream.channelId) return Promise.resolve(null);
  console.log('load', stream);
  return client.req({
    ...stream,
    type: 'messages:load',
    limit: stream.limit || 50,
  })
    .catch((err) => console.log(err) || []);
};

const addMessages = (res) => db.messages
  .bulkPut(res.data.map((m) => ({...m, parentId: m.parentId ? m.parentId : ''})));

export const MessagesContext = ({ children }) => {
  const [stream] = useStream();
  const [streamIdx, setStreamIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const loadPage = usePageLoader(stream);

  useEffect(() => {
    load({...stream, limit: 1}).then((res) => {
      console.log(res);
      if (!res) return;
      setPage(Math.floor((res.res?.maxIdx || 0) / PAGE_SIZE));
      addMessages(res);
      setLoaded(true);
    });
  }, [stream]);

  useEffect(() => {
    if (!loaded) return;
    console.log(page);
    loadPage(page - 1);
    loadPage(page);
    loadPage(page + 1);
  }, [loadPage, page, loaded]);

  const messages = useStreamPage(stream, page);

  const api = {
    streamIdx,
    setStreamIdx: (idx) => {
      if (!loaded) return;
      if (!idx) return;
      // console.log(idx, Math.floor(idx / PAGE_SIZE));
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
