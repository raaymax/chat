/* eslint-disable no-await-in-loop */
import { createEventListener } from './utils';

export function createPool(address) {
  const cons = [];
  const getCon = () => cons.find((c) => c.readyState === 1);
  const rmCon = (ws) => cons.splice(cons.findIndex((c) => c === ws), 1);
  const { notify, watch } = createEventListener();

  function createConnection() {
    try {
      const ws = new WebSocket(address);
      cons.push(ws);
      ws.addEventListener('close', () => {
        notify('close');
        rmCon(ws);
        setTimeout(() => createConnection(), 1000);
      });
      ws.addEventListener('open', () => {
        notify('open', ws);
      });
      ws.addEventListener('error', (event) => {
        notify('error', event);
      });
      ws.addEventListener('message', (raw) => notify('packet', raw));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setTimeout(() => createConnection(), 1000);
    }
  }

  async function send(msg) {
    const con = getCon();
    if (!con) {
      throw new Error('WebSocket is not connected');
    }
    con.send(msg);
  }

  createConnection();
  return {
    cons,
    onOpen: (cb) => watch('open', cb),
    onClose: (cb) => watch('close', cb),
    onError: (cb) => watch('error', cb),
    onPacket: (cb) => watch('packet', cb),
    send,
  };
}
