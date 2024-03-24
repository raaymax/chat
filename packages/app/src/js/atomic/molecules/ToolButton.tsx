import {Button} from '../atoms/Button';
import {Icon} from '../atoms/Icon';
import {Emoji} from './Emoji';

interface ToolButtonProps {
  onClick: () => void;
  icon?: string;
  emoji?: string;
  size: number;
  children?: React.ReactNode;
}

export const ToolButton = ({ onClick, size = 40, icon, emoji, children}: ToolButtonProps) => (
  <Button size={size} onClick={onClick}>
    {icon && <Icon icon={icon} size={size} />}
    {emoji && <Emoji shortname={emoji} size={size} />}
    {children}
  </Button>
);
