import {Button} from '../atoms/Button';
import {Emoji} from './Emoji';
import {useSize} from '../../contexts/size';

interface ButtonWithEmojiProps {
  onClick: () => void;
  emoji: string;
  size?: number;
  children?: React.ReactNode;
}

export const ButtonWithEmoji = ({ onClick, size, emoji, children}: ButtonWithEmojiProps) => {
  const $size = size ?? useSize();
  return (
    <Button size={$size} onClick={onClick}>
      <Emoji shortname={emoji} size={$size/2} />
      {children}
    </Button>
  );
}
