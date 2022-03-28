import { 
  getEarliestDate,
  getLatestDate,
  insertMessage,
  removeMessage,
  updateMessage
} from '/js/store/messages.js';
import { getChannel } from '/js/store/channel.js';
import { getUser } from '/js/store/user.js';
import con from '/js/connection.js';

export const loadPrevious = () => con.req({op: {type: 'load', channel: getChannel(), before: getEarliestDate()}});
export const loadNext = () => con.req({op: {type: 'load', channel: getChannel(), after: getLatestDate()}});
export const load = () => con.req({op: {type: 'load', channel: getChannel()}});

const createCounter = (prefix) => {
  let counter = 0;
  return () => prefix + ':' + (counter++);
}

const tempId = createCounter('temp');

export const send = async (msg) => {
  msg.channel = getChannel();
  msg.id = tempId();
  msg.user = getUser();
  msg.createdAt = new Date();
  insertMessage(msg);
  try{
    const {resp: {data: update}} = await con.req(msg);
    removeMessage(msg.id);
    insertMessage(update);
  }catch(errr){
    console.log('timeout');
    updateMessage(msg.id, {info: {msg: "Sending message failed", type: 'error'}})
  }
}
