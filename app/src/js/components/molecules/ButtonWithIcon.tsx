import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useSize } from '../contexts/useSize';
import { ClassNames } from '../../utils';

interface ButtonWithIconProps {
  onClick?: (e: React.MouseEvent) => void;
  icon?: string;
  size?: number;
  iconSize?: number;
  children?: React.ReactNode;
  className?: ClassNames;
}

export const ButtonWithIcon = ({
  onClick, size, icon, iconSize, children, className,
}: ButtonWithIconProps) => {
  const $size = useSize(size);
  if (!iconSize) {
    iconSize = $size ? $size / 2 : $size;
  }
  return (
    <Button size={$size} onClick={onClick} className={className}>
      {icon && <Icon icon={icon} size={iconSize} />}
      {children}
    </Button>
  );
};
