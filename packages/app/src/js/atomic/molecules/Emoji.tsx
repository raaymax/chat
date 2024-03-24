import styled from 'styled-components';
import { getUrl } from '../../services/file';
import { Tooltip } from '../atoms/Tooltip';
import { useEmoji } from '../../hooks';

const StyledEmoji = styled.span<{$size: number}>`
  img{
    height: ${(props) => (props.$size)}px;
    width: ${(props) => (props.$size)}px;
    vertical-align: bottom;
    display: inline-block;
  }
  span {
    font-size: ${(props) => (props.$size)}px;
    line-height: ${(props) => (props.$size)}px;
  }
`;

interface EmojiProps {
  shortname: string;
  size: number;
}

export const Emoji = ({ shortname, size}: EmojiProps) => {
  const emoji = useEmoji(shortname);

  if (!emoji || emoji.empty) return <span className='emoji'>{shortname}</span>;

  return (
    <Tooltip text={shortname}>
      <StyledEmoji className="emoji" $size={size} data-emoji={shortname}>
        {emoji.unicode
          ? <span>{String.fromCodePoint(parseInt(emoji.unicode, 16))}</span>
          : <img src={getUrl(emoji.fileId)} alt={shortname} />}
      </StyledEmoji>
    </Tooltip>
  );
};
