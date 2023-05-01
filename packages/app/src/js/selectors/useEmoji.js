import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import {client} from '../core';
import Emojis from '../../assets/emoji_list.json';

export const useEmoji = (shortname) => useLiveQuery(async () => {
  if (!shortname) return {}
  let emoji = Emojis.find((e) => e.shortname === shortname);
  if (!emoji) emoji = await db.emojis.get({shortname})
  if (!emoji) {
    const res = await client.req({ type: 'emoji:find', shortname });
    await db.emojis.bulkPut(res.data);
  }
  return emoji || {shortname, empty: true};
}, [shortname]);
