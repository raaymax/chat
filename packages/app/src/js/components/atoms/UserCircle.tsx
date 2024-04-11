import styled from 'styled-components';
import { cn, ClassNames } from '../../utils';
import { useSelector } from '../../store';

const Image = styled.img`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
`;

type UserCircleProps = {
  userId: string;
  className?: ClassNames;
}

export const UserCircle = ({ userId, className }: UserCircleProps) => {
  // FIXME: state type
  const user = useSelector((state) => state.users[userId]);
  if (!user) return null;
  return (
    <Image className={cn(className)} src={user.avatarUrl} alt={user.name} />
  );
};
