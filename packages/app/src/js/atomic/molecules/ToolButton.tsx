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
    {icon && <Icon className={icon} size={size/2.3} />}
    {emoji && <Emoji shortname={emoji} size={size/2} />}
    {children}
  </Button>
);
