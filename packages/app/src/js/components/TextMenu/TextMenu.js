import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useInput } from '../../contexts/conversation';
import { Menu } from './elements/menu';

export const TextMenu = ({
  className, options, open = false, select, selected = 0, setSelected,
}) => {
  const [coords, setCoords] = useState( [0, 0]);
  const { input, range} = useInput();

  const getXPos = useCallback(() => {
    const inBox = input.current.getBoundingClientRect();
    const width = parseInt(window.getComputedStyle(input.current).width.replace('px', ''), 10);
    if (coords[1] + 300 > width) {
      return width - 300;
    }
    return coords[1];
  }, [input, coords])

  const getYPos = () => coords[0];

  useEffect(() => {
    const inputEl = input.current;
    if (!inputEl || !range) return;
    const box = range.getBoundingClientRect();
    const inBox = inputEl.getBoundingClientRect();
    setCoords([box.bottom - inBox.top, box.left - inBox.left]);
  }, [input, range]);

  const ctrl = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      setSelected(selected + 1 > 4 ? 4 : selected + 1);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === 'ArrowDown') {
      setSelected(selected - 1 < 0 ? 0 : selected - 1);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [selected, setSelected]);

  useEffect(() => {
    const { current } = input;
    current.addEventListener('keydown', ctrl);
    return () => {
      current.removeEventListener('keydown', ctrl);
    }
  }, [input, ctrl]);

  return open && (
    <Menu className={className} top={getYPos()} left={getXPos()} height={options.length} >
      <ul>
        {options.map((e, idx) => (
          <li key={idx} onclick={(e) => select(idx, e)} class={idx === selected ? 'selected' : ''}>
            {e.icon && <span><i class={e.icon} /></span>}
            {e.label && <span>{e.label}</span>}
            {e.url && <span><img src={e.url} alt="img" /></span>}
            <span>{e.name}</span>
          </li>
        ))}
      </ul>
    </Menu>
  );
}
