import {
  useRef, useEffect, useState, useCallback,
} from 'react';
import styled from 'styled-components';
import { useStream } from '../contexts/stream';
import { MessageListRenderer, MessageListRendererProps } from './MessageListRenderer';
import { Message as MessageType } from '../../types';

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

const getMax = (list: MessageType[]) => list.reduce((acc, item) => Math.max(acc, new Date(item.createdAt).getTime()), new Date('1970-01-01').getTime());

type MessageListProps = MessageListRendererProps & {
  list: any[];
  onScrollTop?: () => void;
  onScrollBottom?: () => void;
  onDateChange?: (date: string) => void;
  date?: Date;
};

export const MessageList = (props: MessageListProps) => {
  const {
    list, onScrollTop, onScrollBottom, onDateChange, date, ...rest
  } = props;
  const element = useRef<HTMLDivElement>(null);
  const [oldList, setOldList] = useState<MessageType[]>([]);
  const [current, setCurrent] = useState<[Date | undefined, DOMRect | undefined]>([date, undefined]);
  const [selected, setSelected] = useState<string | undefined>();
  const [stream] = useStream();

  const detectDate = useCallback((e: any) => {
    const c = e.target.getBoundingClientRect();
    const r = [...e.target.children]
      .filter((child) => child.className.includes('message'))
      .find((child) => {
        const e = child.getBoundingClientRect();
        return e.y < c.height / 2 + 50;
      });
    if (r) {
      const date = r.getAttribute('data-date');
      if (setCurrent) {
        setCurrent([date, r.getBoundingClientRect()]);
      }
      if (onDateChange) onDateChange(date);
    }
  }, [setCurrent, onDateChange]);

  // fix scroll position when scrolling and new messages are added/removed from the list
  useEffect(() => {
    if (!element?.current) return;
    if (list === oldList) return;
    const getRect = (): DOMRect | undefined => {
      if(!element.current) return;
      return [...element.current.children]
        ?.find((child) => child.getAttribute('data-date') === current[0]?.toISOString())
        ?.getBoundingClientRect();
    }
    const max = getMax(list);
    const oldMax = getMax(oldList);
    if (new Date(max).toISOString() !== new Date(oldMax).toISOString()) {
      const rect = getRect();
      if(!rect) return;
      if (stream.type === 'live') {
        element.current.scrollTop = 0;
      } else if (rect && current && current[1]?.y) {
        element.current.scrollTop += (rect.y - current[1].y);
      }
      setCurrent([current[0], rect]);
    }
    setOldList(list);
  }, [list, stream, oldList, setOldList, current, setCurrent]);

  // scroll selected item into view
  useEffect(() => {
    if (!element.current) return;
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

  const scroll = useCallback((e: any) => {
    detectDate(e);
    if (!element.current) return;
    if (list !== oldList) return;

    if (Math.floor(Math.abs(element.current.scrollTop)) <= 1) {
      onScrollBottom && onScrollBottom();
    } else if (Math.floor(Math.abs(
      element.current.scrollHeight - element.current.offsetHeight + element.current.scrollTop,
    )) <= 1) {
      onScrollTop && onScrollTop();
    }
  }, [detectDate, list, oldList, onScrollTop, onScrollBottom]);

  return (
    <ListContainer ref={element} onScroll={scroll} >
      <div className='space'>&nbsp;</div>
      <MessageListRenderer list={list} {...rest} />
    </ListContainer>
  );
};

export default MessageList;
