import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

window.db = db;

db.version(1).stores({
  global: 'key',
  messages: 'clientId, id, createdAt, [channelId+parentId+streamIdx]',
  users: 'id, name',
  channels: 'id, name',
});
