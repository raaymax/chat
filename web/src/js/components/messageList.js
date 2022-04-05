import {
  html, useState, useEffect, useRef, createCooldown,
} from '../utils.js';
import { watchMessages, deleteBefore } from '../store/messages.js';
import { Message } from './message.js';
import { Notification } from './notification.js';
import { loadPrevious } from '../services/messages.js';

const loadPrev = createCooldown(loadPrevious, 100);

export function MessageList() {
  const [messages, setMessages] = useState([]);
  const list = useRef(null);
  const stop = useRef(null);

  const getH = () => parseInt(window.getComputedStyle(list.current).height.split(' ')[0], 10);

  function onScroll(e) {
    const msgs = [...list.current.querySelectorAll('.message')];
    const H = getH();
    const current = msgs.find((el) => (el.offsetTop - H + 20 < e.srcElement.scrollTop));

    const top = e.srcElement.scrollHeight - H + e.srcElement.scrollTop;
    if (top < 10) {
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
    setMessages([...(m || [])]); // fixme: hack for refreshing
  });

  let prev;
  return html`
    <div class="message-list" ref=${list}>
      <div key='bottom' id='scroll-stop' ref=${stop}></div>
      ${messages.map((msg) => {
    let sameUser = false;
    if (!msg.priv) {
      sameUser = prev
            && prev?.user?.id === msg?.user?.id
            && (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
    }
    prev = msg;
    return (
      msg.notif
        ? html`<${Notification} 
                  key=${msg.id}
                  className=${[msg.notifType]}>
                  ${msg.notif}
                <//>`
        : html`
              <${Message} 
                class=${msg.priv ? ['private'] : []} 
                data-id=${msg.id}
                key=${msg.id}
                sameUser=${sameUser}
                data=${msg}
              />`
    );
  }).reverse()}
    </div>
  `;
}
