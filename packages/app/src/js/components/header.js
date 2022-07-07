import {h} from 'preact';
import { useSelector } from 'react-redux';
import { Channel } from './channels';
import { selectors } from '../state';

export const Header = ({onclick}) => {
  const channel = useSelector(selectors.getCurrentChannel);

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
