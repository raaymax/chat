import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../../components/Channels/Channel';
import { useStream } from '../../contexts/stream';
import { useMessage } from '../../hooks';
import { Toolbar } from '../../atomic/organisms/Toolbar';

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
    flex: 0;
    display:flex;
    flex-direction: row;
  }
`;

export const Header = ({ onClick }) => {
  const [{ channelId, parentId }, setSideStream] = useStream();
  const message = useMessage(parentId);
  const dispatch = useDispatch();

  return (
    <StyledHeader>
      <h1>Thread</h1>
      <Channel onClick={onClick} channelId={channelId} />

      <Toolbar className="toolbar" size={50} opts = {[
        {icon: 'fa-solid fa-arrow-left', handler: () => {
          setSideStream(null);
          dispatch.actions.stream.open({
            id: 'main',
            value: {
              channelId, type: 'archive', selected: message.id, date: message.createdAt,
            },
          });
        }},
        {icon: 'fa-solid fa-xmark', handler: () => dispatch.actions.stream.open({id: 'side', value: null})},
      ].filter(i => Boolean(i))} />
    </StyledHeader>
  );
};
