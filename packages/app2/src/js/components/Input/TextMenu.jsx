import { useState, useEffect, useCallback } from 'react';
import { useInput } from './InputContext';
import { Menu } from './elements/menu';

export const TextMenu = ({
  className, options, open = false, select, selected = 0, setSelected,
}) => {
  const [coords, setCoords] = useState([0, 0]);
  const { input, getRange } = useInput();

  const getXPos = useCallback(() => {
    const width = parseInt(window.getComputedStyle(input.current).width.replace('px', ''), 10);
    if (coords[1] + 300 > width) {
      return width - 300;
    }
    return coords[1];
  }, [input, coords]);

  const getYPos = () => coords[0];

  useEffect(() => {
    const inputEl = input.current;
    const range = getRange();
    if (!inputEl || !range) return;
    const box = range.getBoundingClientRect();
    const inBox = inputEl.getBoundingClientRect();
    setCoords([box.bottom - inBox.top, box.left - inBox.left]);
  }, [input, getRange]);

  const ctrl = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      setSelected(selected + 1 > options.length - 1 ? options.length - 1 : selected + 1);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === 'ArrowDown') {
      setSelected(selected - 1 < 0 ? 0 : selected - 1);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [selected, setSelected, options]);

  useEffect(() => {
    const { current } = input;
    current.addEventListener('keydown', ctrl);
    return () => {
      current.removeEventListener('keydown', ctrl);
    };
  }, [input, ctrl]);

  return open && (
    <Menu className={className} top={getYPos()} left={getXPos()} height={options.length} >
      <ul>
        {options.map((e, idx) => (
          <li key={idx} onClick={(e) => select(idx, e)} className={idx === selected ? 'selected' : ''}>
            {e.icon && <span><i className={e.icon} /></span>}
            {e.url && <span><img src={e.url} alt="img" /></span>}
            {!e.icon && !e.url && <span>{e.label || ''}</span>}
            <span>{e.name}</span>
          </li>
        ))}
      </ul>
    </Menu>
  );
};
