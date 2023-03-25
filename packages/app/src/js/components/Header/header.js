import { h } from 'preact';
import { useSelector, useDispatch } from 'react-redux';
import { Channel } from '../../channels';
import { BackToMainButton } from './elements/backToMainButton';
import { selectors } from '../../state';
import { useStream } from '../streamContext';
import { selectors, actions } from '../../../state';
import { loadPinnedMessages } from '../../../services/pins';
import { init } from '../../../services/init';
import { useStream } from '../../streamContext';

export const Header = ({onclick}) => {
  const [{channelId, parentId}, setStream] = useStream();
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
      {parentId && <h1>Thread</h1>}
      {channelId && <Channel onclick={onclick} channelId={channelId}/>}
      {window.location.hash.slice(1) !== '' && <BackToMainButton />}
      <div class='toolbar'>
        {children}
        {!parentId && (
          <div class='tool' onclick={() => {
            dispatch(init(true));
          }}>
            <i class="fa-solid fa-arrows-rotate" />
          </div>
        )}
        {!parentId && (
          <div class='tool' onclick={() => dispatch(actions.setView('search'))}>
            <i class="fa-solid fa-magnifying-glass" />
          </div>
        )}
        {!parentId && (
          <div class='tool' onclick={() => {
            dispatch(loadPinnedMessages(channelId));
            dispatch(actions.setView('pins'));
          }}>
            <i class="fa-solid fa-thumbtack" />
          </div>
        )}
        {stream.type === 'archive' && (
          <div class='tool' onclick={() => {
            dispatch(actions.messagesClear({stream}));
            setStream({...stream, type: 'live' })
          }}>
            <i class="fa-solid fa-down-long" />
          </div>
        )}
        {parentId && (
          <div class='tool' onclick={() => {
            setStream(null);
            dispatch(setStream('main', {
              channelId, type: 'archive', selected: message.id, date: message.createdAt,
            }));
          }}>
            <i class="fa-solid fa-arrow-left" />
          </div>
        )}
        {parentId && (
          <div class='tool' onclick={() => dispatch(setStream('side', null))}>
            <i class="fa-solid fa-xmark" />
          </div>
        )}
      </div>
    </StyledHeader>
  );
};
