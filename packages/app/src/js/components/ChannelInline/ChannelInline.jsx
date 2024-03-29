import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon } from '../../atomic/atoms/Icon';
import PropTypes from 'prop-types';

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
    <InlineChannelLink className='channel' data-id={id} href={`#${channel?.id || id}`} onClick={() => {
      dispatch.actions.stream.open({id: 'main', value: { type: 'live', channelId: channel?.id || id }});
      dispatch.actions.view.set(null);
    }} >
      { channel?.private ? <Icon icon='lock' /> : <Icon icon="hash" /> }
      <span className='name'>{channel?.name || channel?.id || id}</span>
    </InlineChannelLink>
  );
};

ChannelInline.propTypes = {
  channelId: PropTypes.string,
};
