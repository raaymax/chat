import { h } from 'preact';
import { useCallback, useState, useEffect } from 'preact/hooks';
import { db } from '../db/db';
import { client } from '../core';

export default (stream) => {
  const [pages, setPages] = useState([]);
  useEffect(() => {
    setPages([]);
  }, [stream]);

  const getPage = useCallback((date) => pages.find((p) => p.minDate <= date && date <= p.maxDate)?.page || 0, [pages]);

  const loadPage = useCallback(async (page) => {
    if (!stream.channelId) return Promise.resolve(null);
    const r = await db.messagesIndex.get({
      channelId: stream.channelId,
      parentId: stream.parentId || '',
      page,
    });
    if (page >= 0 && Date.now() - (r?.refreshedAt || 0) > 60000) {
      db.messagesIndex.put({
        channelId: stream.channelId,
        parentId: stream.parentId || '',
        page,
        refreshedAt: Date.now(),
      });
      console.log({
        ...stream,
        type: 'messages:load',
        ...((page < 0) ? { before: stream.date } : { after: stream.date }),
        limit: 50,
        offset: 50 * page,
      });
      return client.req({
        ...stream,
        type: 'messages:load',
        ...((page < 0) ? { before: stream.date } : { after: stream.date }),
        limit: 50,
        offset: 50 * page,
      })
        .then((res) => {
          if (!res) return;
          setPages([...pages, {
            id,
            minDate: res.minDate,
            maxDate: res.maxDate,
          }]);
          db.messages
            .bulkPut(res.data.map((m) => ({
              ...m,
              parentId: m.parentId ? m.parentId : '',
            })));
        })
        .catch((err) => {
          db.messagesIndex.delete({
            channelId: stream.channelId,
            parentId: stream.parentId || '',
            page,
          });
        });
    }
  }, [stream, pages, setPages]);
  return {loadPage, getPage};
}
