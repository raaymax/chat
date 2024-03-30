import styled from 'styled-components';
import {Badge} from '../atoms/Badge';
import {TextWithIcon} from './TextWithIcon';
import {cn, ClassNames} from '../../utils';

const Container = styled.div`
  cursor: pointer;
  &.active {
    background-color: var(--primary_active_mask);
  }
  &:hover {
    background-color: var(--primary_active_mask);
  }
  &.system {
    color: ${(props) => props.theme.userSystem};
  }
  &.connected {
    color: ${(props) => props.theme.userConnected};
  }
  &.recent {
    color: ${(props) => props.theme.userActive};
  }
  &.offline {
    color: ${(props) => props.theme.userDisconnected};
  }
`;

type ChannelNameProps = {
  id: string;
  children: any;
  badge: number;
  className: ClassNames;
  onClick: () => void;
  icon: string;
};

export const ChannelName = ({
  id, children, badge, className, onClick, icon = 'fa-solid fa-hashtag',
}: ChannelNameProps) => (
  <Container className={cn('channel', className)} data-id={id} onClick={onClick}>
    <TextWithIcon icon={icon}>{children}</TextWithIcon> 
    {badge > 0 && <Badge>{badge}</Badge>}
  </Container>
)
