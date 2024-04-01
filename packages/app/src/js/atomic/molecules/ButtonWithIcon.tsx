import {Button} from '../atoms/Button';
import {Icon} from '../atoms/Icon';
import {useSize} from '../contexts/size';
import {ClassNames} from '../../utils';

interface ButtonWithIconProps {
  onClick?: (e: React.MouseEvent) => void;
  icon: string;
  size?: number;
  children?: React.ReactNode;
  className?: ClassNames;
}

export const ButtonWithIcon = ({ onClick, size, icon, children, className}: ButtonWithIconProps) => {
  const $size = useSize(size);
  return (
    <Button size={$size} onClick={onClick} className={className}>
      <Icon icon={icon} size={$size ? $size/2.3 : $size} />
      {children}
    </Button>
  );
}
