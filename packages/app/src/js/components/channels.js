import { h} from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import { openChannel } from '../services/channels';
import { selectors } from '../state';

export const Channel = ({
  name, cid, private: priv, onclick, active, icon
}) => (
  <div class={`channel ${active ? 'active' : ''}`}data-id={cid} onclick={onclick}>
    {!icon && ( priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' />) }
    {icon && <i class={icon} />}
    <span class='name'>{name || cid}</span>
  </div>
)

export const Channels = ({icon}) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.getChannels);
  const cid = useSelector(selectors.getCid);
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => (
        <Channel
          {...c}
          active={cid === c.cid}
          key={c.id}
          icon={icon}
          onclick={() => dispatch(openChannel({cid: c.cid}))}
        />
      ))}
    </div>
  )
}
