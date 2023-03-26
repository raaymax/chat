import { h } from 'preact';
import styled from 'styled-components';
import {getUrl} from '../../../services/file';

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
  img {
    width: 28px;
    height: 28px;
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
      : <span>{String.fromCodePoint(parseInt(unicode, 16))}</span>}
  </EmojiContainer>
)
