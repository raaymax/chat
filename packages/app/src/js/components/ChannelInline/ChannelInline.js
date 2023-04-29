import { h} from 'preact';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { findChannel } from '../../services/channels';
import { selectors } from '../../state';
import { useChannel } from '../../selectors';

const InlineChannelLink = styled.a`
  span {
    padding-left: 1px;
  }
`;

export const ChannelInline = ({channelId: id}) => {
  const channel = useChannel(id);
  return (
    <InlineChannelLink className='channel' data-id={id} href={`#${channel?.id || id}`} >
      { channel?.private ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' /> }
      <span class='name'>{channel?.name || channel?.id || id}</span>
    </InlineChannelLink>
  );
}
