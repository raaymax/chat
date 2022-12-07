import { h} from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import { openChannel } from '../services/channels';
import { selectors } from '../state';
import styled from 'styled-components';

const Badge = styled.span`
  border-radius: 10px;
  background-color: #af0000;
  color: #ffffff;
  font-size: 0.8em;
  padding: 3px 5px;
`;

export const Channel = ({
  name, cid, private: priv, onclick, active, icon, badge
}) => (
  <div class={`channel ${active ? 'active' : ''}`}data-id={cid} onclick={onclick}>
    {!icon && ( priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' />) }
    {icon && <i class={icon} />}
    <span class='name'>{name || cid}</span>
    {badge > 0 && <Badge>{badge}</Badge>}
  </div>
)

export const Channels = ({icon}) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.getChannels);
  const userId = useSelector(selectors.getMyId);
  const badges = useSelector(selectors.getBadges(userId));
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
          badge={badges[c.id]}
          onclick={() => dispatch(openChannel({cid: c.cid}))}
        />
      ))}
    </div>
  )
}
