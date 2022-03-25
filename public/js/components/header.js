import {html, useState} from '/js/utils.js';
import {watchChannel} from '/js/store/channel.js';


export const Header = () => {
  const [channel, setChannel] = useState('main');
  watchChannel((m) => setChannel(m || 'main'));

  return html`
    <div id="workspace-header">${channel}</div>     
  `
}
