import { init } from "./db.ts";

export { user } from "./userRepo.ts";
export { session } from "./sessionRepo.ts";
export { channel } from "./channelRepo.ts";
export { message } from "./messageRepo.ts";
export { invitation } from "./invitationRepo.ts";
export { emoji } from "./emojiRepo.ts";
export { badge } from "./badgeRepo.ts";
export { connect, disconnect, init, ObjectId } from "./db.ts";

init("mongodb://chat:chat@localhost:27017/chat?authSource=admin");
