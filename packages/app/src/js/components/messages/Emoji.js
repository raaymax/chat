import { h } from 'preact';
import {useSelector, useDispatch} from 'react-redux';
import {selectors} from '../../state';
import {default as Emojis, findEmoji} from '../../services/emoji';
import styled from 'styled-components';


const StyledEmoji = styled.span`
  img{
    height: ${props=>props.big ? 3 : 1.5}em;
    width: ${props=>props.big ? 3 : 1.5}em;
    vertical-align: middle;
  }
`;


export const Emoji = ({shortname, big}) => {
  const dispatch = useDispatch();
  const custom = useSelector(selectors.getEmoji(shortname));
  const emoji = Emojis.find((e) => e.shortname === shortname);
  if (emoji) {
    return <span class='emoji' emoji={shortname}>{String.fromCodePoint(parseInt(emoji.unicode, 16))}</span>;
  }
  if (!custom) {
    dispatch(findEmoji(shortname));
  }
  if (!custom || custom.empty) return <span class='emoji' emoji={shortname}>{shortname}</span>;

  return <StyledEmoji big={big} className='emoji' emoji={shortname}><img src={custom.url} alt={shortname} /></StyledEmoji>;
}
