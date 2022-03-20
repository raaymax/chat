
export const createConnection = async (setup, ready) => {
  const connect = async () => {
    console.log("Connecting to ",'ws://localhost:8000/ws')
    const ws = new WebSocket('ws://localhost:8000/ws');
    setup(ws);
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if(ws.readyState === 1) {
          clearInterval(timer)
          resolve(ws);
        }
      }, 10);
    })
  }
  let conPromise = connect();

  const proxy = {
    send: async function send(msg){
      console.log('send', msg);
      const raw = typeof msg === 'string' ? msg : JSON.stringify(msg);
      console.log('string', raw);
      const con = await conPromise;
      if(con.readyState === 1){
        con.send(raw)
      }else {
        conPromise = connect();
        send(raw);
      }
    }
  }
  ready(proxy);
  return proxy;
}

