import styled from 'styled-components';
import {Badge} from '../../../atomic/atoms/Badge';
import {Icon} from '../../../atomic/atoms/Icon';
import PropTypes from 'prop-types';

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
  &.system{
    color: ${(props) => props.theme.userSystem};
  }
  &.connected{
    color: ${(props) => props.theme.userConnected};
  }
  &.recent{
    color: ${(props) => props.theme.userActive};
  }
  &.offline {
    color: ${(props) => props.theme.userDisconnected};
  }
`;

export const InlineChannel = ({
  id, children, badge, className, onClick, icon = 'fa-solid fa-hashtag',
}) => (
  <Container className={`channel ${className || ''}`} data-id={id} onClick={onClick}>
    <Icon className={icon} />
    <span className='name'>{children}</span>
    {badge > 0 && <Badge>{badge}</Badge>}
  </Container>
)

InlineChannel.propTypes = {
  id: PropTypes.string,
  children: PropTypes.any,
  badge: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
};
