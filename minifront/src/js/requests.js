const waiting = {}
const register = (seqId) => {
  let timeout = null;
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      delete waiting[seqId];
      reject(new Error('timeout'));
    }, 1000)
    waiting[seqId] = (msg) => {
      clearTimeout(timeout);
      if(msg.status = 'ok') {
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
    return register(msg.seqId)
  };

  Object.assign(con, { ID, req });
}
