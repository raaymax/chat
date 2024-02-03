/* eslint-disable no-restricted-syntax */
import {
  useRef, useEffect, useState, useCallback,
} from 'react';
import styled from 'styled-components';
import { useStream } from '../../contexts/stream';
import PropTypes from 'prop-types';

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

const getMax = (list) => list.reduce((acc, item) => new Date(Math.max(acc, new Date(item.createdAt))), new Date('1970-01-01'));

export const MessageList = (props) => {
  const {
    formatter, list, onScrollTop, onScrollBottom, onDateChange, date,
  } = props;
  const element = useRef(null);
  const [oldList, setOldList] = useState([]);
  const [current, setCurrent] = useState([date]);
  const [selected, setSelected] = useState(null);
  const [stream] = useStream();

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
      if (setCurrent) setCurrent([date, r])
      if (onDateChange) onDateChange(date);
    }
  }, [setCurrent, onDateChange]);

  // fix scroll position when scrolling and new messages are added/removed from the list
  useEffect(() => {
    if (!element.current) return;
    if (list === oldList) return;
    const getRect = () => [...element.current.children]
      ?.find((child) => child.getAttribute('data-date') === current[0])
      ?.getBoundingClientRect();
    const max = getMax(list);
    const oldMax = getMax(oldList);
    if (max.toISOString() !== oldMax.toISOString()) {
      const rect = getRect();
      if (stream.type === 'live') {
        element.current.scrollTop = 0;
      } else if (rect && current && current[1]?.y) {
        element.current.scrollTop += (rect.y - current[1].y);
      }
    }
    const rect = getRect();
    setCurrent([current[0], rect]);
    setOldList(list);
  }, [list, stream, oldList, setOldList, current, setCurrent]);

  // scroll selected item into view
  useEffect(() => {
    if (stream.selected === selected) return;
    const found = [...element.current.children]
      ?.find((child) => child.getAttribute('data-id') === stream.selected);

    if (found) {
      setTimeout(() => {
        found.scrollIntoView({ block: 'center' });
      }, 100);
      setSelected(stream.selected);
    }
  }, [stream, list, selected, setSelected]);

  const scroll = useCallback((e) => {
    detectDate(e);
    if (list !== oldList) return;

    if (Math.floor(Math.abs(element.current.scrollTop)) <= 1) {
      onScrollBottom();
    } else if (Math.floor(Math.abs(
      element.current.scrollHeight - element.current.offsetHeight + element.current.scrollTop,
    )) <= 1) {
      onScrollTop();
    }
  }, [detectDate, list, oldList, onScrollTop, onScrollBottom]);

  return (
    <ListContainer ref={element} onScroll={scroll} >
      <div className='space'>&nbsp;</div>
      {formatter ? formatter(props) : list}
    </ListContainer>
  );
};

MessageList.propTypes = {
  formatter: PropTypes.func,
  list: PropTypes.array,
  onScrollTop: PropTypes.func,
  onScrollBottom: PropTypes.func,
  onDateChange: PropTypes.func,
  date: PropTypes.string,
};

export default MessageList;
