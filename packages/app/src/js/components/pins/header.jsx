import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../Channels/Channel';
import { useStream } from '../../contexts/stream';
import { Toolbar } from '../../atomic/atoms/Toolbar';
import { ButtonWithIcon } from '../../atomic/molecules/ButtonWithIcon';

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
  const [{channelId}] = useStream();

  return (
    <StyledHeader>
      <Channel channelId={channelId} icon="fa-solid fa-thumbtack" />
      <Toolbar className="toolbar" size={50}>
        <ButtonWithIcon icon="xmark" onClick={() => dispatch.actions.view.set('pins')} />
      </Toolbar>
    </StyledHeader>
  );
};
