import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { db } from '../db/db';
import { client } from '../core';

export default (stream) => useCallback(async (page) => {
  if (!stream.channelId) return Promise.resolve(null);
  const r = await db.messagesIndex.get({
    channelId: stream.channelId,
    parentId: stream.parentId || '',
    page,
  })
  if (page >= 0 && Date.now() - (r?.refreshedAt || 0) > 60000) {
    db.messagesIndex.put({
      channelId: stream.channelId,
      parentId: stream.parentId || '',
      page,
      refreshedAt: Date.now(),
    })
    return client.req({
      ...stream,
      type: 'messages:load',
      page
    })
      .then((res) => {
        if (!res) return;
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
        })
      })
  }
}, [stream])
