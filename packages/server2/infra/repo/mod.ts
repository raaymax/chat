import { disconnect, init } from './db.ts';

export {user} from './userRepo.ts';
export {session} from './sessionRepo.ts';
export {EntityId} from './EntityId.ts';

init('mongodb://chat:chat@localhost:27017/chat?authSource=admin');

export const close = async () => {
  await disconnect();
}
