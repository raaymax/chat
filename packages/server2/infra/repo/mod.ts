import { init } from './db.ts';

export {user} from './userRepo.ts';
export {session} from './sessionRepo.ts';
export {channel} from './channelRepo.ts';
export { disconnect, init, connect, ObjectId } from './db.ts';

init('mongodb://chat:chat@localhost:27017/chat?authSource=admin');

