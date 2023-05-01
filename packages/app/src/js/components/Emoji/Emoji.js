import { h } from 'preact';
import styled from 'styled-components';
import {getUrl} from '../../services/file';
import {Tooltip} from '../../elements/tooltip';
import {useEmoji} from '../../selectors';

const StyledEmoji = styled.span`
  img{
    height: ${(props) => (props.big ? 2 : 1.5)}em;
    width: ${(props) => (props.big ? 2 : 1.5)}em;
    vertical-align: bottom;
    display: inline-block;
  }
  span {
    font-size: ${(props) => (props.big ? 2 : 1)}em;
    line-height: ${(props) => (props.big ? 40 : 24)}px;
  }
`;

export const Emoji = ({shortname, big}) => {
  const emoji = useEmoji(shortname);

  if (!emoji || emoji.empty) return <span class='emoji' emoji={shortname}>{shortname}</span>;
  return (
    <Tooltip text={shortname}>
      <StyledEmoji big={big} emoji={shortname}>
        {emoji.fileId && <img src={getUrl(emoji.fileId)} alt={shortname} /> }
        {emoji.unicode && <span>{String.fromCodePoint(parseInt(emoji.unicode, 16))}</span> }
      </StyledEmoji>
    </Tooltip>
  );
}
