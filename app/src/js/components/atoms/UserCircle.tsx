import styled from 'styled-components';
import { cn, ClassNames } from '../../utils';
import { useSelector } from '../../store';
import { getUrl } from '../../services/file';

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
    return <Image className={cn(className, 'here')} x-attr={user?.avatarFileId} src={getUrl(user?.avatarFileId)} alt={user.name} />
  }
  return <Image className={cn(className, 'here')} src='/avatar.png' alt={user.name} />
};
