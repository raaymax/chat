const waiting = {}
const register = (seqId, source) => {
  let timeout = null;
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      delete waiting[seqId];
      reject({seqId: source.id, resp: { status: 'timeout', source }});
    }, 5000)
    waiting[seqId] = (msg) => {
      msg.source = source;
      clearTimeout(timeout);
      if(msg.resp.status == 'ok') {
        resolve(msg);
      }else{
        reject(msg);
      }
    }
  })
}
const done = (msg) => waiting[msg.seqId] && waiting[msg.seqId](msg);

export function initRequests(con) {
  con.on('resp', (srv, msg) => done(msg));

  const ID = (Math.random() + 1).toString(36);
  let nextSeq = 0;

  const req =  async (msg) => {
    msg.seqId = ID + ':' + (nextSeq++);
    con.send(msg);
    return register(msg.seqId, msg)
  };

  Object.assign(con, { ID, req });
}
