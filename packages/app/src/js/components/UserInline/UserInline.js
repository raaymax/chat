import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { selectors } from '../../state';
import { gotoDirectChannel } from '../../services/channels';

const InlineUserLink = styled.a`
  span {
    padding-left: 1px;
    color: ${(props) => props.theme.mentionsColor};
  }
`;

export const UserInline = ({ userId: id }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectors.getUser(id));

  return (
    <InlineUserLink className='channel' onClick={() => dispatch(gotoDirectChannel(id))} data-id={id} href={`#`} >
      <span class='name'>@{user?.name || id}</span>
    </InlineUserLink>
  );
};
