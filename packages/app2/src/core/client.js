import { Capacitor } from '@capacitor/core';
import { connected, disconnected } from '../js/store/connectionSlice';
import { createNotifier } from '../js/utils';
import { useSelector, useDispatch } from 'react-redux';


function connect1() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(), 5000);

    const client = new WebSocket(getUri());
    

  })

  }



export function connect(dispatch, watch) {
  let pingTimeout;
  console.log('connecting');
  const client = new WebSocket(getUri());

  const handle = (msg) => client.send(JSON.stringify(msg));
  const stopWatching = watch(handle);

  function heartbeat() {
    console.log('dye')
    clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
      stopWatching();
      client.close();
    }, 5000);
  }

  client.addEventListener('open', () => {
    dispatch(connected());
    return heartbeat();
  });

  client.addEventListener('message', (raw) => {
    const msg = JSON.parse(raw.data);
    if (msg.type === 'ping') {
      client.send(JSON.stringify({type: 'response', seqId: msg.seqId, status: 'ok'}));
      return heartbeat();
    }
    dispatch({type: msg.type, payload: msg});
  });
  client.addEventListener('error', (err) => dispatch({type: 'error', payload: err}));
  client.addEventListener('close', () => {
    dispatch(disconnected());
    clearTimeout(pingTimeout);
  });
}

function getUri() {
  let protocol = 'ws:';
  if (document.location.protocol === 'https:') {
    protocol = 'wss:';
  }

  // eslint-disable-next-line no-nested-ternary
  return Capacitor.isNativePlatform()
    ? SERVER_URL
    : `${protocol}//${document.location.host}/ws`;
}



