import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Image = styled.img`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
`;

export const UserCircle = ({ userId, className }) => {
  const user = useSelector((state) => state.users[userId]);
  if (!user) return null;
  return (
    <Image className={className} src={user.avatarUrl} alt={user.name} />
  );
};

UserCircle.propTypes = {
  userId: PropTypes.string,
  className: PropTypes.string,
};
