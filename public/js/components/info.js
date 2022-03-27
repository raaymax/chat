
import {html, useState} from '/js/utils.js';
import {watchInfo} from '/js/store/info.js';

export const Info = () => {
  const [info, setInfo] = useState(null);
  watchInfo((m) => setInfo(m));

  return info && html`
    <div class=${["info", info.type].join(' ')}>${info.msg}</div>     
  `
}
