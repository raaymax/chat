import { useEmoji } from '../../hooks';
import styled from 'styled-components';
import { getUrl } from '../../services/file';
import { Tooltip } from '../atoms/Tooltip';
import { useSize } from '../contexts/useSize';

const StyledEmoji = styled.span<{$size?: number}>`
  padding: 0;
  margin: 0;
  ${(props) => props.$size ? `
  font-size: ${props.$size}px;
  line-height: ${props.$size}px;
  ` : ''}
  img{
    ${(props) => props.$size ? `
    height: ${props.$size}px;
    width: ${props.$size}px;
    ` : ''}
    vertical-align: bottom;
    display: inline-block;
  }
`;

interface EmojiBaseProps {
  shortname: string;
  emoji: {
    unicode?: string;
    fileId?: string;
    empty?: boolean;
  },
  size?: number;
}

export const EmojiBase = ({ shortname, emoji, size}: EmojiBaseProps) => {
  const $size = useSize(size);
  if (!emoji || emoji.empty) return <span className='emoji'>{shortname}</span>;

  return (
    <Tooltip text={shortname}>
      <StyledEmoji className="emoji" $size={$size} data-emoji={shortname}>
        {emoji.unicode
          ? String.fromCodePoint(parseInt(emoji.unicode, 16))
          : <img src={getUrl(emoji.fileId)} alt={shortname} />}
      </StyledEmoji>
    </Tooltip>
  );
};

interface EmojiProps {
  shortname: string;
  size?: number;
}

export const Emoji = ({ shortname, size}: EmojiProps) => {
  const emoji = useEmoji(shortname);
  return <EmojiBase shortname={shortname} emoji={emoji} size={size} />;
};
