import { html, useState } from '../utils.js';
import { watchInfo } from '../store/info.js';

export const Info = () => {
  const [info, setInfo] = useState(null);
  watchInfo((m) => setInfo(m));

  return info && html`
    <div class=${['info', info.type].join(' ')}>${info.msg}</div>     
  `;
};
