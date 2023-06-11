import { h } from 'preact';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectors } from '../../state';

const InlineUserLink = styled.a`
  span {
    padding-left: 1px;
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
