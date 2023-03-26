import { h } from 'preact';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectors } from '../../state';

const Image = styled.img`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
`;

export const UserCircle = ({userId, className}) => {
  const user = useSelector(selectors.getUser(userId));
  if (!user) return null;
  return (
    <Image className={className} src={user.avatarUrl} alt={user.name} />
  );
};
