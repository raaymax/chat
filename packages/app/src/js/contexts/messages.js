import { h, createContext } from 'preact';
import {
  useContext, useEffect, useState, useCallback,
} from 'preact/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { useStream } from './stream';
import { client } from '../core';
import { db } from '../db/db';

const Context = createContext({
  data: {},
});

const load = async (stream) => client.req({
  ...stream,
  type: 'messages:load',
  limit: stream.limit || 50,
})
  .then((res) => res.data)
  .catch((err) => console.log(err) || []);

const loadDate = async (stream) => Promise.all([
  load({...stream, before: stream.date, limit: 50}),
  load({...stream, after: stream.date, limit: 50}),
]).then(([before, after]) => [...before, ...after]);

export const MessagesContext = ({ children }) => {
  const [stream] = useStream();
  const [streamIdx, setStreamIdx] = useState(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState({});
  const [lastStream, setLastStream] = useState({});
  const [maxIdx, setMaxIdx] = useState(null);
  const [minIdx, setMinIdx] = useState(null);
  const [busy, setBusy] = useState(false);

  const addMessages = useCallback((data = []) => {
    db.messages.bulkPut(data.map((m) => ({
      ...m,
      parentId: (m.parentId ? m.parentId : ''),
    })));

    setBusy(false);
    let min = Infinity;
    let max = -Infinity;
    data.forEach(({streamIdx}) => {
      if (streamIdx < min) min = streamIdx;
      if (streamIdx > max) max = streamIdx;
    });
    setMinIdx(min);
    setMaxIdx(max);
    return [min, max];
  }, [setBusy, setMinIdx, setMaxIdx]);

  const updateIdx = useCallback(([minIdx, maxIdx]) => {
    setStreamIdx((maxIdx + minIdx) / 2);
    setPage(Math.floor(((maxIdx + minIdx) / 2) / 100));
  }, [setStreamIdx]);

  useEffect(() => {
    if (lastStream.channelId !== stream.channelId
      || lastStream.parentId !== stream.parentId
      || lastStream.type !== stream.type
    ) {
      setPages({});
      db.global.put({key: 'channelId', value: stream.channelId});
      setLastStream(stream);
      setBusy(true);
      (stream.date ? loadDate(stream) : load(stream)) // FIXME - do not rely on dates
        .then(addMessages)
        .then(updateIdx);
    }
  }, [setLastStream, setBusy, addMessages, lastStream, stream, setStreamIdx]);

  const loadPage = useCallback((page) => {
    if (busy) return;
    if (pages[page]) return;
    console.log('loading page', page);
    await load({...stream, page, limit: 20}).then(addMessages)
    return load({...stream, page, limit: 20}).then(m=>console.log(page, m) || m).then(addMessages)
  }, [stream, busy, addMessages, pages]);

  useEffect(() => {
    console.log(page);
    loadPage(page - 2);
    loadPage(page - 1);
    loadPage(page);
    loadPage(page + 1);
    loadPage(page + 2);
    setPages({
      ...pages,
      [page - 2]: true,
      [page - 1]: true,
      [page]: true,
      [page + 1]: true,
      [page + 2]: true,
    });
  }, [page, setPages]);

  const api = {
    messages: useLiveQuery(async () => {
      const parent = stream.parentId ? [await db.messages.get({id: stream.parentId})] : [];
      const parentId = stream.parentId || '';
      const channelId = stream.channelId || await db.global.get({key: 'channelId'}).value || '';
      const ms = await db.messages
        .where(['channelId', 'parentId', 'streamIdx'])
        .between(
          [channelId, parentId, streamIdx - 25],
          [channelId, parentId, streamIdx + 25],
          true,
          true,
        )
        .reverse()
        .sortBy('createdAt')

      return [...ms, ...parent];
    }, [stream, streamIdx]),

    stream,
    streamIdx: [streamIdx, (idx) => {
      setStreamIdx(idx);
      setPage(Math.floor(idx / 20));
    }],
    nextPage: () => {
      if (busy) return;
      load({...stream, afterIdx: streamIdx})
        .then((loaded) => addMessages(loaded))
    },
    prevPage: () => {
      if (busy) return;
      load({...stream, beforeIdx: streamIdx})
        .then((loaded) => addMessages(loaded))
    },
  }
  return (
    <Context.Provider value={api}>
      {children}
    </Context.Provider>
  );
};

export const useMessages = () => useContext(Context);
export const useStreamIdx = () => useContext(Context).streamIdx;
