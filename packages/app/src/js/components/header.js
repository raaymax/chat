import {h} from 'preact';
import { useState } from '../utils.js';
import { getCurrent, watchCurrent } from '../store/channels';
import { Channel } from './channels';

export const Header = ({onclick}) => {
  const [channel, setChannel] = useState(getCurrent());
  watchCurrent((m) => setChannel(m));

  return (
    <div id="workspace-header">
      <Channel onclick={onclick} {...channel} />
      {channel?.cid !== 'main' && (
        <div class="back">
          <a href='#main'>
            back to main
          </a>
        </div>)}
    </div>
  );
};
