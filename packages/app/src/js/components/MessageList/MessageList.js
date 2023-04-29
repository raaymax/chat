/* eslint-disable no-restricted-syntax */
import { h } from 'preact';
import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
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
  const [idx, setIdx] = useState([]);
  const [stream] = useStream();
  const {streamIdx, setStreamIdx} = useMessages();

  const detectStreamIdx = useCallback((e) => {
    const c = e.target.getBoundingClientRect();
    const r = [...e.target.children].find((child) => {
      const e = child.getBoundingClientRect();
      return e.y < c.height / 2 + 50 && (e.y + e.height) > c.height / 2 - 50;
    });
    if (r) {
      const idx = r.getAttribute('data-idx');
      if (setStreamIdx) setStreamIdx(idx)
    }
  }, [setStreamIdx]);

  useEffect(() => {
    if (!element.current) return;
    if (list === oldList) return;
    const max = getMax(list);
    const oldMax = getMax(oldList);
    if (max !== oldMax) {
      //if (stream.type === 'live') {
      //  element.current.scrollTop = 0;
      //} else {
        const rect = [...element.current.children]
          ?.find((child) => child.getAttribute('data-idx') === idx[0])
          ?.getBoundingClientRect();
        if (rect && idx) {
          element.current.scrollTop += (rect.y - idx[1].y);
        }
      //}
    }
    const rect = [...element.current.children]
      ?.find((child) => child.getAttribute('data-idx') === streamIdx)
      ?.getBoundingClientRect();
    setIdx([streamIdx, rect]);
    setOldList(list);
  }, [list, stream, oldList, setOldList, streamIdx, idx, setIdx]);

  const scroll = useCallback((e) => {
    // TODO: on scroll up change stream type to archive
    detectStreamIdx(e);
  }, [detectStreamIdx]);
  return (
    <ListContainer ref={element} onScroll={scroll} >
      {formatter ? formatter(props) : list}
      <div class='space'>&nbsp;</div>
    </ListContainer>
  );
};

export default MessageList;
