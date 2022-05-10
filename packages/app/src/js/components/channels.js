import {h} from 'preact';
import {useState} from 'preact/hooks';
import {watchChannels, getChannels } from '../store/channels';
import {openChannel} from '../services/channels';

const Channel = ({name, cid}) => (
  <div class='channel' onclick={() => openChannel({cid})}>{name}</div>
)

export const Channels = () => {
  const [channels, setChannels] = useState(getChannels());
  watchChannels((c) => setChannels([...c]));
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => <Channel name={c.name} cid={c.cid} key={c.id} />) }
    </div>
  )
}
