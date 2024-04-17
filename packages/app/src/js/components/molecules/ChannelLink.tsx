import { useEffect } from 'react';
import { useActions, useMethods, useSelector } from '../../store';
import styled from 'styled-components';
import { Icon } from '../atoms/Icon';

const StyledChannelLink = styled.a`
  span {
    padding-left: 1px;
  }
`;

type ChannelInlineProps = {
  channelId: string;
};

export const ChannelLink = ({ channelId: id }: ChannelInlineProps) => {
  const methods = useMethods();
  const actions = useActions();
  const channel = useSelector((state) => state.channels[id]);
  useEffect(() => {
    if (!channel) {
      methods.channels.find(id);
    }
  }, [id, channel, methods]);
  return (
    <StyledChannelLink className='channel' data-id={id} href={`#${channel?.id || id}`} onClick={() => {
      actions.stream.open({id: 'main', value: { type: 'live', channelId: channel?.id || id }});
      actions.view.set(null);
    }} >
      { channel?.private ? <Icon icon='lock' /> : <Icon icon="hash" /> }
      <span className='name'>{channel?.name || channel?.id || id}</span>
    </StyledChannelLink>
  );
};
