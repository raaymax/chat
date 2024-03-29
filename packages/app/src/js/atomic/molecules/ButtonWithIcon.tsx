import {Button} from '../atoms/Button';
import {Icon} from '../atoms/Icon';
import {useSize} from '../../contexts/size';

interface ButtonWithIconProps {
  onClick: () => void;
  icon: string;
  size?: number;
  children?: React.ReactNode;
}

export const ButtonWithIcon = ({ onClick, size, icon, children}: ButtonWithIconProps) => {
  const $size = size ?? useSize();
  return (
    <Button size={$size} onClick={onClick}>
      <Icon icon={icon} size={$size/2.3} />
      {children}
    </Button>
  );
}
