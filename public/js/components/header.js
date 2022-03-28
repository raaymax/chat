import {html, useState} from '/js/utils.js';
import {watchChannel, getChannel} from '/js/store/channel.js';


export const Header = () => {
  const [channel, setChannel] = useState(getChannel());
  watchChannel((m) => setChannel(m));

  return html`
    <div id="workspace-header">
      <div class="channel">${channel}</div>     
      ${channel !== 'main' && html`<div class="back"><a href='#main'>back to main</a></div>`}
    </div>
  `
}
