import { getEarliestDate, getLatestDate } from '/js/store/messages.js';
import { getChannel } from '/js/store/channel.js';
import con from '/js/connection.js';

export const loadPrevious = () => con.req({op: {type: 'load', channel: getChannel(), before: getEarliestDate()}});
export const loadNext = () => con.req({op: {type: 'load', channel: getChannel(), after: getLatestDate()}});
export const load = () => con.req({op: {type: 'load', channel: getChannel()}});
