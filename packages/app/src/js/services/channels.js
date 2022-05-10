import { client } from '../core';
import { getChannel } from '../store/channels';
import { setInfo } from '../store/info';

export const openChannel = async (q = {}) => {
  const channel = getChannel(q);
  try {
    await client.req({ command: { name: 'channel', args: [channel.cid] } })
  } catch (err) {
    setInfo({ msg: `Cannot change channel ${err.resp.data.message}`, type: 'error' }, 10000);
  }
}

export const loadChannels = async () => client.req({op: {type: 'channels'}});
