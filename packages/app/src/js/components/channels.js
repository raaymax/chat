import {h} from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import {openChannel} from '../services/channels';

export const Channel = ({
  name, cid, private: priv, onclick, active,
}) => (
  <div class={`channel ${active ? 'active' : ''}`}data-id={cid} onclick={onclick}>
    {priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' /> }
    <span class='name'>{name || cid}</span>
  </div>
)

export const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.list);
  const cid = useSelector((state) => state.channels.current);
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => (
        <Channel
          {...c}
          active={cid === c.cid}
          key={c.id}
          onclick={() => dispatch(openChannel({cid: c.cid}))}
        />
      ))}
    </div>
  )
}
