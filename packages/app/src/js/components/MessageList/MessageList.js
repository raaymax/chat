/* eslint-disable no-restricted-syntax */
import { h } from 'preact';
import {
  useRef, useEffect, useState, useCallback,
} from 'preact/hooks';
import styled from 'styled-components';
import { useStream } from '../../contexts/stream';
import { useMessages } from '../../contexts/messages';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  background-color: var(--primary_background);
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1;
  overscroll-behavior: contain;

  .space {
    height: 50px;
  }
`;

const getMax = (list) => list.reduce((acc, item) => Math.max(acc, item.streamIdx), -Infinity);

export const MessageList = (props) => {
  const {formatter, list} = props;
  const element = useRef(null);
  const [oldList, setOldList] = useState([]);
  const [current, setCurrent] = useState([]);
  const [stream] = useStream();
  const {date, setDate} = useMessages();

  const detectDate = useCallback((e) => {
    const c = e.target.getBoundingClientRect();
    const r = [...e.target.children]
      .filter((child) => child.className.includes('message'))
      .find((child) => {
        const e = child.getBoundingClientRect();
        return e.y < c.height / 2 + 50;
      });
    if (r) {
      const date = r.getAttribute('data-date');
      console.log(date);
      if (setDate) setDate(date)
    }
  }, [setDate]);

  useEffect(() => {
    if (!element.current) return;
    if (list === oldList) return;
    const max = getMax(list);
    const oldMax = getMax(oldList);
    if (max !== oldMax) {
      // if (stream.type === 'live') {
      //  element.current.scrollTop = 0;
      // } else {
      const rect = [...element.current.children]
        ?.find((child) => child.getAttribute('data-date') === current[0])
        ?.getBoundingClientRect();
      if (rect && current && current[1]?.y) {
        element.current.scrollTop += (rect.y - current[1].y);
      }
      // }
    }
    const rect = [...element.current.children]
      ?.find((child) => child.getAttribute('data-date') === date)
      ?.getBoundingClientRect();
    setCurrent([date, rect]);
    setOldList(list);
  }, [list, stream, oldList, setOldList, date, current, setCurrent]);

  const scroll = useCallback((e) => {
    // TODO: on scroll up change stream type to archive
    detectDate(e);
  }, [detectDate]);
  return (
    <ListContainer ref={element} onScroll={scroll} >
      {formatter ? formatter(props) : list}
      <div class='space'>&nbsp;</div>
    </ListContainer>
  );
};

export default MessageList;
