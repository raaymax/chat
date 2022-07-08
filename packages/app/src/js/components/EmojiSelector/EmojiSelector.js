import { h } from 'preact';

import './EmojiSelector.css';
import {
  useState, useEffect,
} from '../../utils';

import {
  install, select, getState, watchState,
} from './EmojiService';

export const installEmojiSelector = install;

export const EmojiSelector = () => {
  const [state, set] = useState(getState());
  useEffect(() => watchState((s) => set({...s})), []);

  const getXPos = () => {
    const width = parseInt(window.getComputedStyle(document.body).width.replace('px', ''), 10);
    if (state.coords[1] + 300 > width) {
      return width - 300;
    }
    return state.coords[1];
  }

  const getYPos = () => state.coords[0];

  return state.open && (
    <div style={`top: ${getYPos()}px; left: ${getXPos()}px;`} class={'emoji-menu'}>
      <ul>
        {state.results.map((e, idx) => (
          <li key={idx} onclick={(e) => select(idx, e)} class={idx === state.selected ? 'selected' : ''}>
            <span>{String.fromCodePoint(parseInt(e.item.unicode, 16))}</span>
            <span>{e.item.shortname}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
