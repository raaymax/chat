import styled from 'styled-components';
import { Conversation } from './Conversation';
import { useDispatch } from 'react-redux';
import { Channel } from '../molecules/NavChannel';
import { useStream } from '../contexts/useStream';
import { useMessage } from '../../hooks';
import { Toolbar } from '../atoms/Toolbar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';

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

type HeaderProps = {
  onClick?: () => void;
};

export const Header = ({ onClick }: HeaderProps) => {
  const [{ channelId, parentId }, setSideStream] = useStream();
  const message = useMessage(parentId);
  const dispatch: any = useDispatch();

  return (
    <StyledHeader>
      <h1>Thread</h1>
      <Channel onClick={onClick} channelId={channelId} />

      <Toolbar className="toolbar" size={50}>
        <ButtonWithIcon icon='back' onClick={() => {
          setSideStream(null);
          dispatch.actions.stream.open({
            id: 'main',
            value: {
              channelId, type: 'archive', selected: message.id, date: message.createdAt,
            },
          });
        }} />
        <ButtonWithIcon icon='xmark' onClick={() => dispatch.actions.stream.open({id: 'side', value: null})} />
      </Toolbar>
    </StyledHeader>
  );
};

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;

type SideConversationProps = {
  className?: string;
};

export const SideConversation = ({ className }: SideConversationProps) => (
  <Container className={className}>
    <Header />
    <Conversation />
  </Container>
);
