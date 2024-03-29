import styled from 'styled-components';
import {Badge} from '../atoms/Badge';
import {Icon} from '../atoms/Icon';

const Container = styled.div`
 padding: 5px 5px 5px 20px; 
 cursor: pointer;
 .name {
   padding: 0px 10px; 
   cursor: pointer;
  }
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
  className: string;
  onClick: () => void;
  icon: string;
};

export const ChannelName = ({
  id, children, badge, className, onClick, icon = 'fa-solid fa-hashtag',
}: ChannelNameProps) => (
  <Container className={`channel ${className || ''}`} data-id={id} onClick={onClick}>
    <Icon icon={icon} />
    <span className='name'>{children}</span>
    {badge > 0 && <Badge>{badge}</Badge>}
  </Container>
)
