import { client } from '../core';
import { getChannel } from '../store/channels';
import { setInfo } from '../store/info';

window.addEventListener('hashchange', async () => {
  const cid = window.location.hash.slice(1);
  try {
    await client.req({ command: { name: 'channel', args: [cid] } })
  } catch (err) {
    setInfo({ msg: `Cannot change channel ${err.resp.data.message}`, type: 'error' }, 10000);
  }
}, false);

export const openChannel = async (q = {}) => {
  const channel = getChannel(q);
  window.location.hash = channel.cid;
}

export const loadChannels = async () => client.req({op: {type: 'channels'}});
