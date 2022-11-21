import { h } from 'preact';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import {selectors} from '../../state';
import {default as Emojis, findEmoji} from '../../services/emoji';
import {getUrl} from '../../services/file';

const StyledEmoji = styled.span`
  img{
    height: ${props=>props.big ? 3 : 1.5}em;
    width: ${props=>props.big ? 3 : 1.5}em;
    vertical-align: bottom;
    display: inline-block;
  }
`;

export const Emoji = ({shortname, big}) => {
  const dispatch = useDispatch();
  const custom = useSelector(selectors.getEmoji(shortname));
  const emoji = Emojis.find((e) => e.shortname === shortname);

  if (emoji && !emoji.empty) {
    return (
      <StyledEmoji class='emoji' emoji={shortname}>
        {emoji.unicode
          ? String.fromCodePoint(parseInt(emoji.unicode, 16))
          : <img src={getUrl(custom.fileId)} alt={shortname} />}
      </StyledEmoji>
    );
  }
  if (!custom) {
    dispatch(findEmoji(shortname));
  }
  if (!custom || custom.empty) return <span class='emoji' emoji={shortname}>{shortname}</span>;

  return <StyledEmoji big={big} className='emoji' emoji={shortname}><img src={getUrl(custom.fileId)} alt={shortname} /></StyledEmoji>;
}
