import { h } from 'preact';
import { useMainChannelId } from '../../hooks';
import { useStream } from '../../contexts/stream';

export const BackToMain = () => {
  const mainChannelId = useMainChannelId();
  const [stream] = useStream();
  return mainChannelId && mainChannelId !== stream.channelId && (
    <div class="back">
      <a href='/#'>
        back to main
      </a>
    </div>
  );
};
