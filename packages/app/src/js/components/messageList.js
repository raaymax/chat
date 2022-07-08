import { h } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Message } from './message';
import { Notification } from './notification';
import { loadPrevious} from '../services/messages';
import { actions, selectors } from '../state';

export const useCooldown = (fn, time, deps) => {
  const cb = useCallback(fn, [...deps, fn]);
  let cooldown = false;
  return async () => {
    if (!cooldown) {
      cooldown = true;
      setTimeout(() => { cooldown = false; }, time);
      return cb();
    }
  };
};

export function MessageList() {
  const list = useRef(null);
  const stop = useRef(null);

  const getH = () => parseInt(window.getComputedStyle(list.current).height.split(' ')[0], 10);
  const messages = useSelector(selectors.getMessages);
  const dispatch = useDispatch();

  const loadPrev = useCooldown(() => dispatch(loadPrevious()), 100, [dispatch]);

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
        dispatch(actions.removeMessagesBefore(id));
      }
    }
    const el = list.current;
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [list, dispatch, loadPrev]);

  let prev;
  return (
    <div class="message-list" ref={list}>
      <div key='bottom' id='scroll-stop' ref={stop} />
      {messages.map((msg) => {
        let sameUser = false;
        if (!msg.priv) {
          sameUser = prev
            && prev?.userId === msg?.userId
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
              client-id={msg.clientId}
              key={msg.id || msg.clientId}
              sameUser={sameUser}
              data={msg}
            />
        );
      }).reverse()}
    </div>
  )
}
