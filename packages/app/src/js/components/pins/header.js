import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../Channels/Channel';
import { selectors, actions } from '../../state';

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
    flex: 0 50px;
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
  i {
    flex: 0 50px;
    line-height: 50px;
    text-align: center;
    vertical-align: middle;
  }
`;

export const Header = () => {
  const dispatch = useDispatch();
  const channelId = useSelector(selectors.getChannelId);

  return (
    <StyledHeader>
      <Channel channelId={channelId} icon="fa-solid fa-thumbtack" />
      <div class='toolbar'>
        <div class='tool' onclick={() => dispatch(actions.setView('pins'))}>
          <i class="fa-solid fa-xmark" />
        </div>
      </div>
    </StyledHeader>
  );
};
