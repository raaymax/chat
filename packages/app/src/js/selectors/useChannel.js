import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import {client} from '../core';

export const useChannel = (id) => useLiveQuery(async () => {
  if (!id) return {}
  const channel = await db.channels.get({id})
  if (!channel) {
    const res = await client.req({ type: 'channel:find', id });
    await db.channels.bulkPut(res.data);
  }
  return channel || {};
}, [id]);
