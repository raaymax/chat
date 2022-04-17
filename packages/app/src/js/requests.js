const waiting = {};
const register = (seqId, source) => {
  let timeout = null;
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      delete waiting[seqId];
      const err = new Error('TIMEOUT');
      Object.assign(err, { seqId: source.id, resp: { status: 'timeout', source } });
      reject(err);
    }, 2000);
    waiting[seqId] = (msg) => {
      msg.source = source;
      clearTimeout(timeout);
      if (msg.resp.status === 'ok') {
        resolve(msg);
      } else {
        reject(msg);
      }
    };
  });
};
const done = (msg) => waiting[msg.seqId] && waiting[msg.seqId](msg);

export function initRequests(client) {
  client.on('resp', (srv, msg) => done(msg));

  const ID = (Math.random() + 1).toString(36);
  let nextSeq = 0;

  const genSeqId = () => `${ID}:${nextSeq++}`;

  const req = async (msg) => {
    if (!msg.seqId) {
      msg.seqId = genSeqId();
    }
    client.send(msg);
    return register(msg.seqId, msg);
  };

  Object.assign(client, { ID, req, genSeqId });
}
