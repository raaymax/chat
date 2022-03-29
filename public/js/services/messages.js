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

const tempId = createCounter('temp:'+(Math.random() + 1).toString(36));

export const send = async (msg) => {
  if(msg.command) return sendCommand(msg);
  sendMessage(msg);
}

export const sendCommand = async (msg) => {
  const id = tempId();
  insertMessage({id, notifType: 'info', notif: msg.command.name + " sent", createdAt: new Date()});
  try{
    const {resp: {data: update}} = await con.req(msg);
    insertMessage({id, notifType: 'success', notif: msg.command.name + " executed successfully", createdAt: new Date()});
  }catch(errr){
    insertMessage({id, notifType: 'error', notif: msg.command.name + " error", createdAt: new Date()});
  }
}

const sendMessage = async (msg) => {
  const user = getUser();
  if(!user) {
    insertMessage({id: 'login', notifType: 'warning', notif: 'You must login first!', createdAt: new Date()});
    return;
  }
  msg.channel = getChannel();
  msg.clientId = tempId();
  msg.user = getUser();
  msg.createdAt = new Date();
  console.log(msg);
  insertMessage(msg);
  try{
    await con.req(msg);
  }catch(errr){
    console.log('timeout');
    updateMessageC({clientId: msg.clientId, info: {msg: "Sending message failed", type: 'error'}})
  }
}
