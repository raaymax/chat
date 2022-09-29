import { h, render, Component } from 'preact';
import { Provider } from 'react-redux'

import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'preact/hooks';
import store from '../state';

const StyledChild = styled.div`
background-color: green;
margin-bottom: 10px;
`;

const StyledScrollContainer = styled.div`
  width: 50vw;
  height: 50vh;
  position: absolute;
  top: 200px;
  left: 200px;
  background-color: red;
  padding: 10px;
  overflow-y: visible;
  display: flex;
  overflow-y: scroll;
  flex: 1 1 0;
  align-items: stretch;
  flex-flow: column nowrap;
`;

class MessageList extends Component {
  static SCROLL_AT_TOP = 'top';

  static SCROLL_AT_BOTTOM = 'bottom';

  static SCROLL_FREE = 'free';

  static STATUS_LIVE = 'live';
  static STATUS_ARCHIVE = 'archive';

  scrollPosition = MessageList.SCROLL_AT_BOTTOM;

  handleScroll = () => {
    if (this.isResizingFromBottom) {
      this.base.scrollTop = this.base.scrollHeight;
      delete this.isResizingFromBottom;
      return;
    }

    let scrollPosition;
    if (this.base.scrollHeight <= this.base.clientHeight) {
      scrollPosition = MessageList.SCROLL_AT_BOTTOM;
    } else if (this.base.scrollTop === 0) {
      scrollPosition = MessageList.SCROLL_AT_TOP;
    } else if (this.base.scrollHeight === Math.floor(this.base.scrollTop + this.base.clientHeight)) {
      scrollPosition = MessageList.SCROLL_AT_BOTTOM;
    } else {
      scrollPosition = MessageList.SCROLL_FREE;
    }

    if (this.scrollPosition !== scrollPosition) {
      this.scrollPosition = scrollPosition;
      const { onScrollTo } = this.props;
      onScrollTo && onScrollTo(scrollPosition);
    }
  };

  handleResize = () => {
    if (this.scrollPosition === MessageList.SCROLL_AT_BOTTOM) {
      this.base.scrollTop = this.base.scrollHeight;
      this.isResizingFromBottom = true;
      return;
    }

    if (this.base.scrollHeight <= this.base.clientHeight) {
      const { onScrollTo } = this.props;
      this.scrollPosition = MessageList.SCROLL_AT_BOTTOM;
      onScrollTo && onScrollTo(MessageList.SCROLL_AT_BOTTOM);
    }
  };

  shouldComponentUpdate(nextProps) {
    const { props } = this;

    for (const key in props) {
      if (props[key] !== nextProps[key]) {
        return true;
      }
    }

    for (const key in nextProps) {
      if (!(key in props)) {
        return true;
      }
    }

    return false;
  }

  // FIXME: deprecated
  componentWillUpdate() {
    this.previousScrollHeight = this.base.scrollHeight;
  }

  componentDidUpdate() {
    const { status } = this.props;
    if (this.scrollPosition === MessageList.SCROLL_AT_BOTTOM) {
      if (this.status === MessageList.STATUS_LIVE) {
        this.base.scrollTop = this.base.scrollHeight;
      }
      if (this.previousScrollHeight > this.base.scrollHeight) {
        this.base.scrollTop = this.base.scrollTop - this.previousScrollHeight + this.base.scrollHeight;
      }
      return;
    }

    if (this.scrollPosition === MessageList.SCROLL_AT_TOP) {
      const delta = this.base.scrollHeight - this.previousScrollHeight;
      if (delta > 0) {
        this.base.scrollTop = delta;
      }
      delete this.previousScrollHeight;
    }
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const {props} = this;
    return (
      <StyledScrollContainer onScroll={this.handleScroll}>
        {props.list.map((message) => <StyledChild>{message}</StyledChild>)}
      </StyledScrollContainer>
    );
  }
}

let nextIdx = 50;
export const App = () => {
  const [messages, setMessages] = useState(Array(50).fill(0).map((_, idx) => idx));
  const [lastDir, setLastDir] = useState('bottom');
  useEffect(() => {
    if (lastDir === 'top' && messages.length  > 100) {
      setMessages((a) => [...a.slice(0, 100)]);
    }
    if (lastDir === 'bottom' && messages.length  > 100) {
      setMessages((a) => [...a.slice(-100)]);
    }
  }, [setMessages, messages, lastDir]);
  return (
    <Provider store={store}>
      <MessageList list={messages} onScrollTo={(dir) => {
        setLastDir(dir);
        if (dir === 'top') {
          setMessages((m) => [...Array(50).fill(0).map((_, idx) => nextIdx++), ...m]);
        }
        if (dir === 'bottom') {
          setMessages((m) => [...m, ...Array(50).fill(0).map((_, idx) => nextIdx++)])
        }
      }} />
      <button onClick={() => { setMessages([...messages, nextIdx++]) }}>add</button>
      <button onClick={() => { setMessages([nextIdx++, ...messages]) }}>add</button>
    </Provider>
  )
}

render(<App />, document.getElementById('root'));
