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
  const user = useSelector((state) => state.users[userId]);
  if (!user) return null;
  if(user?.avatarFileId) {
    return <Image className={cn(className)} src={getUrl(user?.avatarFileId)} alt={user.name} />
  }
  return <Image className={cn(className)} src='/avatar.png' alt={user.name} />
};
