import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import Emojis from '../../assets/emoji_list.json';

export const useEmojis = () => useLiveQuery(async () => {
  const custom = await db.emojis.toArray();
  return [...custom, ...Emojis];
}, []);
