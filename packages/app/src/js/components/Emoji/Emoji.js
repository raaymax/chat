import { h } from 'preact';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import {selectors} from '../../state';
import Emojis, {findEmoji} from '../../services/emoji';
import {getUrl} from '../../services/file';
import {Tooltip} from '../../elements/tooltip';

const StyledEmoji = styled.span`
  .tooltip-container {
    display: inline-block;
  }
  img{
    height: 1.5em;
    width: 1.5em;
    vertical-align: bottom;
    display: inline-block;
  }
  span {
    font-size: ${(props) => (props.big ? 2 : 1)}em;
    line-height: ${(props) => (props.big ? 40 : 24)}px;
  }
`;

export const Emoji = ({shortname, big}) => {
  const dispatch = useDispatch();
  const custom = useSelector(selectors.getEmoji(shortname));
  const emoji = Emojis.find((e) => e.shortname === shortname);

  if (emoji && !emoji.empty) {
    return (
      <Tooltip text={shortname}>
        <StyledEmoji big={big} emoji={shortname}>
          {emoji.unicode
            ? <span>{String.fromCodePoint(parseInt(emoji.unicode, 16))}</span>
            : <img src={getUrl(custom.fileId)} alt={shortname} />}
        </StyledEmoji>
      </Tooltip>
    );
  }
  if (!custom) {
    dispatch(findEmoji(shortname));
  }
  if (!custom || custom.empty) return <span class='emoji' emoji={shortname}>{shortname}</span>;

  return (
    <Tooltip text={shortname}>
      <StyledEmoji big={big} emoji={shortname}>
        <img src={getUrl(custom.fileId)} alt={shortname} />
      </StyledEmoji>
    </Tooltip>
  );
}
