import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Icon } from '../../atomic/atoms/Icon';

const StyledChannelLink = styled.a`
  span {
    padding-left: 1px;
  }
`;

type ChannelInlineProps = {
  channelId: string;
};

export const ChannelLink = ({ channelId: id }: ChannelInlineProps) => {
  //FIXME dispatch type
  const dispatch: any = useDispatch();
  //FIXME state types
  const channel = useSelector((state: any) => state.channels[id]);
  useEffect(() => {
    if (!channel) {
      dispatch.methods.channels.find(id);
    }
  }, [id, channel, dispatch]);
  return (
    <StyledChannelLink className='channel' data-id={id} href={`#${channel?.id || id}`} onClick={() => {
      dispatch.actions.stream.open({id: 'main', value: { type: 'live', channelId: channel?.id || id }});
      dispatch.actions.view.set(null);
    }} >
      { channel?.private ? <Icon icon='lock' /> : <Icon icon="hash" /> }
      <span className='name'>{channel?.name || channel?.id || id}</span>
    </StyledChannelLink>
  );
};
