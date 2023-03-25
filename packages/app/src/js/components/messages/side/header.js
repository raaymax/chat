import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../../channels';
import { selectors } from '../../../state';
import { useStream } from '../../../contexts/stream';
import { setStream } from '../../../services/stream';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--primary_background);
  background-color: #1a1d21;
  border-bottom: 1px solid #565856;
  height: 51px;

  & h1 {
    padding: 0;
    margin: 0;
    padding-left: 20px;
    width: auto;
    flex: 0;
    font-size: 30px;
    font-weight: 400;
  }
  & * {
    flex: 1;
    height: 50px;
    line-height: 50px;

  }

  & .back {
    text-align: right;
    padding-right: 10px;
  }

  & .channel{
    padding-left: 30px;
    vertical-align: middle;
    font-size: 20px;
    font-weight: bold;
  }
  & .channel i{
    font-size: 1.3em;
  }
  & .channel .name{
    padding-left: 10px;
  }
  & .toolbar {
    flex: 0 100px;
    display:flex;
    flex-direction: row;
    & .tool {
      flex: 1;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: var(--secondary_background);
      }
    }
  }
`;

export const Header = ({ onclick }) => {
  const [{ channelId, parentId}, setSideStream] = useStream();
  const message = useSelector(selectors.getMessage(parentId));
  const dispatch = useDispatch();

  return (
    <StyledHeader>
      <h1>Thread</h1>
      <Channel onclick={onclick} channelId={channelId} />
      <div class='toolbar'>
        <div class='tool' onclick={() => {
          setSideStream(null);
          dispatch(setStream('main', {
            channelId, type: 'archive', selected: message.id, date: message.createdAt,
          }));
        }}>
          <i class="fa-solid fa-arrow-left" />
        </div>
        <div class='tool' onclick={() => dispatch(setStream('side', null))}>
          <i class="fa-solid fa-xmark" />
        </div>
      </div>
    </StyledHeader>
  );
};
