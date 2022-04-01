import { initRequests } from './requests.js';
import { createEventListener } from './utils';
import { createPool } from './pool';

const { notify, watch } = createEventListener();

let protocol = 'ws:';
if (document.location.protocol === 'https:') {
  protocol = 'wss:';
}
const pool = createPool(`${protocol}//${document.location.host}/ws`);

window.pool = pool;

const client = {
  send: async (msg) => {
    // eslint-disable-next-line no-console
    //console.log('send', msg);
    const raw = JSON.stringify(msg);
    await pool.send(raw);
  },
  on: (ev, cb) => {
    watch(ev, cb);
    return client;
  },
};

pool.onOpen(() => notify('con:open', client));
pool.onClose(() => notify('con:close', client));
pool.onError(() => notify('con:error', client));
pool.onPacket((raw) => {
  try {
    const msg = JSON.parse(raw.data);
    notify('packet', msg);
    // eslint-disable-next-line no-console
    //console.log('recv', msg);
    if(msg.priv) console.log('recv', msg);
    if (msg.resp) notify('resp', client, msg);
    else if (msg.op) notify(`op:${msg.op.type}`, client, msg);
    else  notify('message', client, msg);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err, raw);
    notify('packet:error', client, raw, err);
  }
});

initRequests(client);

export default client;
