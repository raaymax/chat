import { h } from 'preact';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectors } from '../../state';

const InlineUserLink = styled.span`
  span {
    padding-left: 1px;
    color: ${props => props.theme.mentionsColor};
  }
`;

export const UserInline = ({ userId: id }) => {
  const user = useSelector(selectors.getUser(id));
  return (
    <InlineUserLink className='channel' data-id={id} href={`#`} >
      <span class='name'>@{user?.name || id}</span>
    </InlineUserLink>
  );
};
