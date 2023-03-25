import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../../channels';
import { selectors, actions } from '../../../state';
import { loadPinnedMessages } from '../../../services/pins';
import { init } from '../../../services/init';
import { useStream } from '../../../contexts/stream';

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
    flex: 0 150px;
    display:flex;
    flex-direction: row-reverse;
    & .tool {
      flex: 0 50px;
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

export const Header = ({onclick}) => {
  const [stream, setStream] = useStream();
  const {channelId, parentId} = stream;
  const dispatch = useDispatch();
  const message = useSelector(selectors.getMessage(parentId));

  if (parentId) {
    return (
      <StyledHeader>
        {parentId && <h1>Thread</h1>}
        <Channel onclick={onclick} channelId={channelId} />

        <div class='toolbar'>

          {stream.id !== 'main' && <div class='tool' onclick={() => setStream(null)}>
            <i class="fa-solid fa-xmark" />
          </div>}
          <div class='tool' onclick={() => (
            setStream({
              channelId, type: 'archive', selected: message.id, date: message.createdAt,
            })
          )}>
            <i class="fa-solid fa-arrow-left" />
          </div>
        </div>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <Channel onclick={onclick} channelId={channelId}/>

      {window.location.hash.slice(1) !== '' && (
        <div class="back">
          <a href='/#'>
            back to main
          </a>
        </div>)}

      <div class='toolbar'>
        <div class='tool' onclick={() => {
          dispatch(init(true));
        }}>
          <i class="fa-solid fa-arrows-rotate" />
        </div>
        <div class='tool' onclick={() => dispatch(actions.setView('search'))}>
          <i class="fa-solid fa-magnifying-glass" />
        </div>
        <div class='tool' onclick={() => {
          dispatch(loadPinnedMessages(channelId));
          dispatch(actions.setView('pins'));
        }}>
          <i class="fa-solid fa-thumbtack" />
        </div>
        {stream.type === 'archive' && (
          <div class='tool' onclick={() => {
            dispatch(actions.messagesClear({stream}));
            setStream({...stream, type: 'live' })
          }}>
            <i class="fa-solid fa-down-long" />
          </div>
        )}
      </div>
    </StyledHeader>
  );
};
