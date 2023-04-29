import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

const PAGE_SIZE = 50;

export default (stream, page) => useLiveQuery(async () => {
  const parent = stream.parentId ? [await db.messages.get({id: stream.parentId})] : [];
  const parentId = stream.parentId || '';
  const channelId = stream.channelId || await db.global.get({key: 'channelId'}).value || '';
  const ms = await db.messages
    .where(['channelId', 'parentId', 'streamIdx'])
    .between(
      [channelId, parentId, page * PAGE_SIZE - 1 * PAGE_SIZE],
      [channelId, parentId, page * PAGE_SIZE + 2 * PAGE_SIZE],
      true,
      true,
    )
    .reverse()
    .sortBy('streamIdx');
  return [...ms, ...parent] || [];
}, [stream, page]);
