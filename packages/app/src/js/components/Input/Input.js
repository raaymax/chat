import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useInput } from '../../contexts/conversation';
import { BaseInput } from '../BaseInput/BaseInput';
import { Attachments } from '../Attachments/Attachments';
import { StatusLine } from '../StatusLine/StatusLine';
import { ActionButton } from './elements/actionButton';
import { EmojiSearch } from '../EmojiSearch/EmojiSearch';
import { ChannelSelector } from '../ChannelSelector/ChannelSelector';
import { buildEmojiNode } from '../../utils';
import { getUrl } from '../../services/file';
import { EmojiSelector } from '../EmojiSelector/EmojiSelector';

export const Input = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const {
    focus, addFile, insert, send,
  } = useInput();

  const onEmojiInsert = useCallback((emoji) => {
    insert(buildEmojiNode(emoji, getUrl));
    setShowEmojis(!showEmojis);
    focus();
  }, [showEmojis, focus, insert, setShowEmojis])

  return (
    <BaseInput>
      <Attachments />
      <div class='actionbar' onclick={focus} action='focus'>
        <div class={showEmojis ? 'action active' : 'action'} onclick={() => setShowEmojis(!showEmojis)}>
          <i class="fa-solid fa-face-smile-beam" />
        </div>
        <div class='action' onclick={addFile}>
          <i class="fa-solid fa-plus" />
        </div>
        <StatusLine />
        <ActionButton className={'action green'} onClick={send} action='submit'>
          <i class="fa-solid fa-paper-plane" />
        </ActionButton>
      </div>
      <ChannelSelector />
      <EmojiSelector />
      {showEmojis && <EmojiSearch onSelect={onEmojiInsert} />}
    </BaseInput>
  );
}
