import { h } from 'preact';
import styled from 'styled-components';
import { getUrl } from '../../../services/file';

const EmojiContainer = styled.div`
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  font-size: 20px;
  align-content: center;
  vertical-align: middle;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  user-select: none;
  font-family: 'Noto Color Emoji', 'Roboto';
  img {
    width: 28px;
    height: 28px;
  }
  body.mobile & {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    font-size: 30px;
    img {
      width: 38px;
      height: 38px;
    }
  }
  &:hover {
    border-radius: 5px;
    background-color: rgba(249,249,249,0.05);
  }
`;

export const Emoji = ({
  unicode, fileId, shortname, onClick,
}) => (
  <EmojiContainer onClick={onClick}>
    {fileId
      ? <img src={getUrl(fileId)} alt={shortname} />
      : <span className='emoji'>{unicode.map((code) => String.fromCodePoint(parseInt(code, 16))).join('')}</span>}
  </EmojiContainer>
);
