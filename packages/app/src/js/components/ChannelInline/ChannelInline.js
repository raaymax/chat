import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const InlineChannelLink = styled.a`
  span {
    padding-left: 1px;
  }
`;

export const ChannelInline = ({ channelId: id }) => {
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channels[id]);
  useEffect(() => {
    if (!channel) {
      dispatch.methods.channels.find(id);
    }
  }, [id, channel, dispatch]);
  return (
    <InlineChannelLink className='channel' data-id={id} href={`#${channel?.id || id}`} >
      { channel?.private ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' /> }
      <span class='name'>{channel?.name || channel?.id || id}</span>
    </InlineChannelLink>
  );
};
