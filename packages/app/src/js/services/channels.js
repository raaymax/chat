import { client } from '../core';
import { getChannel} from '../store/channels';
import { setCid } from '../store/channel';
import { setInfo } from '../store/info';

window.addEventListener('hashchange', async () => {
  const cid = window.location.hash.slice(1);
  setCid(cid)
  client.emit('channel:changed', {channel: cid});
}, false);

export const openChannel = async (q = {}) => {
  const channel = getChannel(q);
  window.location.hash = channel.cid;
};

export const loadChannels = async () => client.req({ type: 'channels' });
