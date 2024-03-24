import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../../components/Channels/Channel';
import { init } from '../../services/init';
import { useStream } from '../../contexts/stream';
import { BackToMain } from '../../components/BackToMain/BackToMain';
import { useMessage } from '../../hooks';
import { loadMessages } from '../../services/messages';
import { ToolButton } from '../../atomic/molecules/ToolButton';

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
    flex: 0 200px;
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

export const Header = ({ onClick }) => {
  const [stream, setStream] = useStream();
  const { channelId, parentId } = stream;
  const dispatch = useDispatch();
  const message = useMessage(parentId);

  if (parentId) {
    return (
      <StyledHeader>
        {parentId && <h1>Thread</h1>}
        <Channel onClick={onClick} channelId={channelId} />

        <div className='toolbar'>

          {stream.id !== 'main' && <div className='tool' onClick={() => setStream(null)}>
            <i className="fa-solid fa-xmark" />
          </div>}
          <div className='tool' onClick={() => (
            setStream({
              channelId, type: 'archive', selected: message.id, date: message.createdAt,
            })
          )}>
            <i className="fa-solid fa-arrow-left" />
          </div>
        </div>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <Channel onClick={onClick} channelId={channelId} />
      <BackToMain />

      <div className='toolbar'>
        <ToolButton icon='fa-solid fa-arrows-rotate' size={50} onClick={() => {
          dispatch(init());
        }} />
        <div className='tool' onClick={() => {
          dispatch(init());
        }}>
          <i className="fa-solid fa-arrows-rotate" />
        </div>
        <div className='tool' onClick={() => dispatch.actions.view.set('search')}>
          <i className="fa-solid fa-magnifying-glass" />
        </div>
        <div className='tool' onClick={() => {
          dispatch.methods.pins.load(channelId);
          dispatch.actions.view.set('pins');
        }}>
          <i className="fa-solid fa-thumbtack" />
        </div>
        {stream.type === 'archive' && (
          <div className='tool' onClick={() => {
            dispatch.actions.messages.clear({ stream });
            setStream({ ...stream, type: 'live' });
            dispatch(loadMessages({ ...stream, type: 'live' }))
          }}>
            <i className="fa-solid fa-down-long" />
          </div>
        )}
      </div>
    </StyledHeader>
  );
};
