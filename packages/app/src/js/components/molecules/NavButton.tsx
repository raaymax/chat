import { ButtonWithIcon } from './ButtonWithIcon';
import {Text} from '../atoms/Text';
import styled from 'styled-components';
import {useSize} from '../contexts/size';
import {ClassNames} from '../../utils';
import {Badge} from '../atoms/Badge';

const StyledButtonWithIcon = styled(ButtonWithIcon)`
  text-align: left;
  width: 100%;
  padding-left: 20px;
  cursor: pointer;

  .text {
    padding-left: 5px;
  }
  &:hover {
    background-color: ${(props) => props.theme.highlightedBackgroundColor};
  }
   
`

type NavButtonProps = {
  size?: number;
  badge?: number;
  icon: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: ClassNames;
  children: React.ReactNode;
} 

export const NavButton = ({className, size, icon, badge, onClick, children}: NavButtonProps) => {
  const $size = useSize(size) ?? 50;
  return (
    <StyledButtonWithIcon className={className} icon={icon} size={$size} onClick={onClick}>
      <Text size={$size/2.5}>{children}</Text>
      {(badge && badge > 0) ? <Badge>{badge}</Badge> : null}
    </StyledButtonWithIcon>
  );
}
