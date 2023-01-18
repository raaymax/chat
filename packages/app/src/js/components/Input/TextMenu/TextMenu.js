import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

import styled from 'styled-components';

const Menu = styled.div`
  position: absolute;
  margin-top: ${(props) => -props.height * 30 - 40}px;
  width: 300px;
  height: ${(props) => props.height * 30 + 20}px;
  background-color: var(--primary_background);
  bottom: 70px;
  left: 20px;
  font-size: 1.2em;
  padding: 10px 0;
  border-radius: 10px;
  border: 1px solid var(--primary_border_color);
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  
  &.hidden {
    display: none;
  }

  & ul{
    padding: 0;
    margin: 0;
    display: flex;
    list-style-type: none;
    flex-direction: column-reverse;
  }

  & ul li {
    height: 30px;
    display: flex;
    flex-direction: row;
    cursor: pointer;

    img {
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      vertical-align: bottom;
    }
  }
  & ul li:hover {
    background-color: var(--primary_active_mask);
  }

  & ul li.selected{
    background-color: var(--primary_active_mask);
  }

  & ul li span:first-child {
    height: 30px;
    width: 30px;
  }
  & ul li span {
    line-height: 30px;
    vertical-align: middle;
    text-align: center;
  }
`;

export const TextMenu = ({
  className, watch, select, input,
}) => {
  const [coords, setCoords] = useState( [0, 0]);
  const [state, setState] = useState({
    open: false,
    container: null,
    options: [],
    selected: 0,
  });

  const getXPos = () => {
    const width = parseInt(window.getComputedStyle(document.body).width.replace('px', ''), 10);
    if (coords[1] + 300 > width) {
      return width - 300;
    }
    return coords[1];
  }

  const getYPos = () => coords[0];

  const onSelectionChange = useCallback(() => {
    const sel = document.getSelection();
    if (!input.contains(sel.anchorNode)) return;
    const box = sel.getRangeAt(0).getBoundingClientRect();
    setCoords([box.bottom, box.left]);
  }, [setCoords, input])

  useEffect(() => {
    document.addEventListener('selectionchange', onSelectionChange);
    const unwatch = watch((s) => {
      onSelectionChange();
      setState(s);
    });
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      unwatch();
    }
  }, [setState, onSelectionChange, watch]);

  return state.open && (
    <Menu className={className} top={getYPos()} left={getXPos()} height={state.options.length} >
      <ul>
        {state.options.map((e, idx) => (
          <li key={idx} onclick={(e) => select(idx, e)} class={idx === state.selected ? 'selected' : ''}>
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
