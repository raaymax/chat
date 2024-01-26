import styled from 'styled-components';
import { getUrl } from '../../services/file';
import { Tooltip } from '../../elements/tooltip';
import { useEmoji } from '../../hooks';
import PropTypes from 'prop-types';

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

export const Emoji = ({ shortname, big }) => {
  const emoji = useEmoji(shortname);

  if (!emoji || emoji.empty) return <span className='emoji'>{shortname}</span>;

  return (
    <Tooltip text={shortname}>
      <StyledEmoji big={big} data-emoji={shortname}>
        {emoji.unicode
          ? <span>{String.fromCodePoint(parseInt(emoji.unicode, 16))}</span>
          : <img src={getUrl(emoji.fileId)} alt={shortname} />}
      </StyledEmoji>
    </Tooltip>
  );
};

Emoji.propTypes = {
  shortname: PropTypes.string,
  big: PropTypes.bool,
};
