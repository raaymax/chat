import { ButtonWithIcon } from '../../atomic/molecules/ButtonWithIcon';
import {Text} from '../atoms/Text';
import styled from 'styled-components';
import {useSize} from '../../contexts/size';
import {ClassNames} from '../../utils';

const StyledButton = styled(ButtonWithIcon)`
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
  icon: string;
  onClick?: (e: React.MouseEvent) => void;
  className: ClassNames;
  children: React.ReactNode;
} 

export const NavButton = ({className, size, icon, onClick, children}: NavButtonProps) => {
  const $size = useSize(size) ?? 50;
  return (
    <StyledButton className={className} icon={icon} size={$size} onClick={onClick}>
      <Text size={$size/2.5}>{children}</Text>
    </StyledButton>
  );
}
