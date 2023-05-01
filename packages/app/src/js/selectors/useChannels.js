import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export const useChannels = () => useLiveQuery(async () => {
  const ms = await db.channels.orderBy('name')
    .toArray();
  return ms || [];
}, []);
