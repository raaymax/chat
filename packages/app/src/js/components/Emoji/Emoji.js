import { h } from 'preact';
import styled from 'styled-components';
import { getUrl } from '../../services/file';
import { Tooltip } from '../../elements/tooltip';
import { useEmoji } from '../../hooks';

const StyledEmoji = styled.span`
  img{
    height: ${(props) => (props.big ? 2 : 1.5)}em;
    width: ${(props) => (props.big ? 2 : 1.5)}em;
    vertical-align: bottom;
    display: inline-block;
  }
  span {
    font-family: 'Noto Color Emoji', 'Roboto';
    font-size: ${(props) => (props.big ? 2 : 1)}em;
    line-height: ${(props) => (props.big ? 40 : 24)}px;
  }
`;

export const Emoji = ({ shortname, big }) => {
  const emoji = useEmoji(shortname);

  if (!emoji || emoji.empty) return <span class='emoji' emoji={shortname}>{shortname}</span>;

  return (
    <Tooltip text={shortname}>
      <StyledEmoji big={big} emoji={shortname}>
        {emoji.unicode
          ? <span>{emoji.unicode.map((code) => String.fromCodePoint(parseInt(code, 16))).join('')}</span>
          : <img src={getUrl(emoji.fileId)} alt={shortname} />}
      </StyledEmoji>
    </Tooltip>
  );
};
