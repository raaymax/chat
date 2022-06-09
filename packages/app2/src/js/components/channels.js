import {h} from 'preact';
import {useState} from 'preact/hooks';
import { watchCid, getCid } from '../store/channel';
import {watchChannels, getChannels } from '../store/channels';
import {openChannel} from '../services/channels';

export const Channel = ({
  name, cid, private: priv, onclick, active,
}) => (
  <div class={`channel ${active ? 'active' : ''}`}data-id={cid} onclick={onclick}>
    {priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' /> }
    <span class='name'>{name}</span>
  </div>
)

export const Channels = () => {
  const [channels, setChannels] = useState(getChannels());
  const [cid, setCid] = useState(getCid());
  watchChannels((c) => setChannels([...c]));
  watchCid((c) => setCid(c));
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => (
        <Channel
          {...c}
          active={cid === c.cid}
          key={c.id}
          onclick={() => openChannel({cid: c.cid})}
        />
      ))}
    </div>
  )
}
