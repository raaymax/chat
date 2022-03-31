import { initRequests } from './requests.js';

const handlers = {};
const notify = (ev, ...args) => (handlers[ev] || []).forEach((h) => h(...args));
// eslint-disable-next-line no-return-assign
const watch = (ev, fn) => (handlers[ev] = handlers[ev] || []).push(fn);
let conPromise = null;

const connect = () => {
  conPromise = new Promise((resolve) => {
    let protocol = 'ws:';
    if (document.location.protocol === 'https:') {
      protocol = 'wss:';
    }
    //const ws = new WebSocket(`${protocol}//${document.location.host}/ws`);
    const ws = new WebSocket(`wss://chat.codecat.io/ws`);
    ws.addEventListener('message', (raw) => {
      try {
        notify('packet', srv, raw);
        const msg = JSON.parse(raw.data);
        // console.log('recv',msg);
        if (msg.resp) notify('resp', srv, msg);
        else if (msg.op) notify(`op:${msg.op.type}`, srv, msg);
        else notify('message', srv, msg);
      } catch (err) {
        notify('packet:error', srv, raw, err);
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
    ws.addEventListener('open', () => resolve(ws));
    ws.addEventListener('close', () => {
      notify('disconnect', srv);
      setTimeout(() => connect(), 1000);
    });
  }).then((ws) => {
    notify('ready', srv);
    return ws;
  });
};
connect();

const getCon = async () => {
  const con = await conPromise;
  if (con.readyState === 1) return con;
  return new Promise((resolve) => { setTimeout(() => getCon().then(resolve), 100); });
};

const srv = {
  send: async (msg) => {
    // console.log('send',msg);
    msg._raw = msg._raw ? msg._raw : JSON.stringify(msg);
    const con = await getCon();
    notify('beforeSend', srv, msg);
    return con.send(msg._raw);
  },
  on: (...arg) => {
    watch(...arg);
    return srv;
  },
};
initRequests(srv);

export default srv;
