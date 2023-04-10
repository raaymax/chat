/* eslint-disable no-restricted-syntax */
import { h, Component } from 'preact';
import { useEffect } from 'preact/hooks';
import styled from 'styled-components';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
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

export class MessageList extends Component {
  static SCROLL_AT_TOP = 'top';

  static SCROLL_AT_BOTTOM = 'bottom';

  static SCROLL_FREE = 'free';

  static STATUS_LIVE = 'live';

  static STATUS_ARCHIVE = 'archive';

  scrollPosition = MessageList.SCROLL_AT_BOTTOM;

  scrollStatus = MessageList.STATUS_LIVE;

  handleScroll = () => {
    if (this.isResizingFromBottom) {
      this.base.scrollTop = this.base.scrollHeight;
      delete this.isResizingFromBottom;
      return;
    }

    let scrollPosition;
    if (!this.base) return;
    if (this.base.scrollHeight <= this.base.clientHeight) {
      scrollPosition = MessageList.SCROLL_AT_BOTTOM;
    } else if (this.base.scrollTop === 0) {
      scrollPosition = MessageList.SCROLL_AT_TOP;
    } else if (
      Math.abs(
        this.base.scrollHeight - Math.floor(this.base.scrollTop + this.base.clientHeight),
      ) <= 2
    ) {
      scrollPosition = MessageList.SCROLL_AT_BOTTOM;
    } else {
      scrollPosition = MessageList.SCROLL_FREE;
    }

    if (this.scrollPosition !== scrollPosition) {
      this.scrollPosition = scrollPosition;
      const { onScrollTo } = this.props;
      // eslint-disable-next-line no-unused-expressions
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
      // eslint-disable-next-line no-unused-expressions
      onScrollTo && onScrollTo(MessageList.SCROLL_AT_BOTTOM);
    }
  };

  shouldComponentUpdate(nextProps) {
    const { props } = this;

    if (nextProps.list !== this.props.list) {
      this.updateScroll = true;
    } else {
      this.updateScroll = false;
    }

    for (const key in Object.keys(props)) {
      if (props[key] !== nextProps[key]) {
        return true;
      }
    }

    for (const key in Object.keys(nextProps)) {
      if (!(key in props)) {
        return true;
      }
    }

    return false;
  }

  // FIXME: deprecated
  componentWillUpdate() {
    document.elementFromPoint(10, 100);
    this.previousScrollHeight = this.base.scrollHeight;
    this.previousScrollTop = this.base.scrollTop;
  }

  componentDidUpdate() {
    if (this.props.selected) {
      const msgs = [...this.base.querySelectorAll('.message')];
      const current = msgs.find((el) => el.getAttribute('data-id') === this.props.selected);
      if (current) current.scrollIntoView();
      return;
    }
    if (!this.updateScroll) return;
    const {status} = this.props;
    if (this.scrollPosition === MessageList.SCROLL_AT_BOTTOM) {
      if (status === MessageList.STATUS_LIVE) {
        this.base.scrollTop = this.base.scrollHeight;
      } else if (this.previousScrollHeight >= this.base.scrollHeight) {
        const heightDelta = this.previousScrollHeight - this.base.scrollHeight;
        const scrollDelta = Math.max(this.previousScrollTop - this.base.scrollTop, 0);
        this.base.scrollTop = this.base.scrollTop - heightDelta + scrollDelta;
      }
      this.previousScrollHeight = this.base.scrollHeight;
      this.handleScroll();
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
      <ListContainer onScroll={this.handleScroll}>
        {props.formatter ? props.formatter(props) : props.list}
        <div class='space'>&nbsp;</div>
      </ListContainer>
    );
  }
}

export default MessageList;
