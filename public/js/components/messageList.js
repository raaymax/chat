import {
  html, useState, useEffect, useRef, createCooldown,
} from '../utils.js';
import { watchMessages, deleteBefore } from '../store/messages.js';
import { Message } from './message.js';
import { Notification } from './notification.js';
import { loadPrevious } from '../services/messages.js';

const loadPrev = createCooldown(loadPrevious, 100);
let init = true;

export function MessageList() {
  const [messages, setMessages] = useState([]);
  const list = useRef(null);
  const stop = useRef(null);

  const getH = () => parseInt(window.getComputedStyle(list.current).height.split(' ')[0], 10);

  function onScroll(e) {
    init = false;
    const msgs = [...list.current.querySelectorAll('.message')];
    const H = getH();
    const current = msgs.findLast((el) => (el.offsetTop < e.srcElement.scrollTop + H - 20));
    if (e.srcElement.scrollTop < 5) {
      loadPrev();
    } else if (current) {
      const id = current.getAttribute('data-id');
      deleteBefore(id);
    }
  }

  useEffect(() => {
    list.current.addEventListener('scroll', onScroll);
    return () => list.current.removeEventListener('scroll', onScroll);
  }, []);

  watchMessages((m) => {
    const position = list.current.scrollHeight - getH() - list.current.scrollTop;
    setMessages([...(m || [])]); // fixme: hack for refreshing
    setTimeout(() => {
      if (init || position < 10) {
        stop.current.scrollIntoView();
      } else {
        list.current.scrollTo(0, list.current.scrollHeight - getH() - position);
      }
    }, 0);
  });

  return html`
    <div class="message-list" ref=${list}>
      ${messages.map((msg) => (msg.notif
    ? html`<${Notification} key=${msg.id} className=${[msg.notifType]}>${msg.notif}<//>`
    : html`
          <${Message} 
            class=${msg.priv ? ['private'] : []} 
            data-id=${msg.id}
            key=${msg.id}
            author=${msg.user?.name || 'Guest'}
            info=${msg.info}
            content=${msg.message}
            date=${msg.createdAt}
          />`))}
      <div key='bottom' id='scroll-stop' ref=${stop}></div>
    </div>
  `;
}
