import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { gotoDirectChannel } from '../../services/channels';
import PropTypes from 'prop-types';

const InlineUserLink = styled.a`
  span {
    padding-left: 1px;
    color: ${(props) => props.theme.mentionsColor};
  }
`;

export const UserInline = ({ userId: id }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users[id]);

  return (
    <InlineUserLink className='channel' onClick={() => dispatch(gotoDirectChannel(id))} data-id={id} href={`#`} >
      <span className='name'>@{user?.name || id}</span>
    </InlineUserLink>
  );
};

UserInline.propTypes = {
  userId: PropTypes.string,
};
