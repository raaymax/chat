import {h} from 'preact';
import {
  useState, useEffect, useRef, createCooldown,
} from '../utils';
import { watchMessages, deleteBefore } from '../store/messages';
import { Message } from './message';
import { Notification } from './notification';
import { loadPrevious, removeMessage } from '../services/messages';

const loadPrev = createCooldown(loadPrevious, 100);

export function MessageList() {
  const [messages, setMessages] = useState([]);
  const list = useRef(null);
  const stop = useRef(null);

  const getH = () => parseInt(window.getComputedStyle(list.current).height.split(' ')[0], 10);

  useEffect(() => {
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
    const el = list.current;
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [list]);

  watchMessages((m) => {
    setMessages([...(m || [])]); // fixme: hack for refreshing
  });

  let prev;
  return (
    <div class="message-list" ref={list}>
      <div key='bottom' id='scroll-stop' ref={stop} />
      {messages.map((msg) => {
        let sameUser = false;
        if (!msg.priv) {
          sameUser = prev
            && prev?.user?.id === msg?.user?.id
            && (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
        }
        prev = msg;
        return (
          msg.notif
            ? <Notification
              key={msg.id || msg.clientId}
              className={[msg.notifType]}>
              {msg.notif}
            </Notification>
            : <Message
              class={msg.priv ? ['private'] : []}
              data-id={msg.id}
              onDelete={() => removeMessage(msg)}
              key={msg.id || msg.clientId}
              sameUser={sameUser}
              data={msg}
            />
        );
      }).reverse()}
    </div>
  )
}
