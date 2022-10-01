import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../channels';
import { selectors, actions } from '../../state';
import { loadPinnedMessages } from '../../services/pins';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--primary_background);
  background-color: #1a1d21;
  border-bottom: 1px solid #565856;
  height: 51px;

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

export const Header = ({onclick}) => {
  const channel = useSelector(selectors.getCurrentChannel);
  const cid = useSelector(selectors.getCid);
  const dispatch = useDispatch();

  return (
    <StyledHeader>
      <Channel onclick={onclick} {...channel} />
      {channel?.cid !== 'main' && (
        <div class="back">
          <a href='#main'>
            back to main
          </a>
        </div>)}
      <div class='toolbar'>
        <div class='tool' onclick={() => {
          dispatch(loadPinnedMessages(cid));
          dispatch(actions.setView('pins'));
        }}>
          <i class="fa-solid fa-thumbtack" />
        </div>
        <div class='tool' onclick={() => dispatch(actions.setView('search'))}>
          <i class="fa-solid fa-magnifying-glass" />
        </div>
      </div>
    </StyledHeader>
  );
};
