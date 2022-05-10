import {h} from 'preact';
import {useState} from 'preact/hooks';
import {watchChannels, getChannels } from '../store/channels';
import {openChannel} from '../services/channels';

export const Channel = ({
  name, cid, private: priv, onclick,
}) => (
  <div class='channel' data-id={cid} onclick={onclick}>
    {priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' /> }
    <span class='name'>{name}</span>
  </div>
)

export const Channels = () => {
  const [channels, setChannels] = useState(getChannels());
  watchChannels((c) => setChannels([...c]));
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => (
        <Channel {...c} key={c.id} onclick={() => openChannel({cid: c.cid})} />
      ))}
    </div>
  )
}
