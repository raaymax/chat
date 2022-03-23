import {html, useState, useEffect, useRef, useMemo} from '/js/utils.js';
import {watchMessages, deleteBefore} from '/js/store/messages.js';
import {Message} from '/js/components/message.js';
import {loadPrevious} from '/js/services/messages.js';

export function MessageList (props) {
  const [messages, setMessages] = useState([]);
  const [H, setH] = useState(10);
  const [posB, setPosB] = useState(0);

  const list = useRef(null);
  function onResize() {
    if(list.current) {
      setH(parseInt(window.getComputedStyle(list.current).height.split(' ')[0]));
      console.log('H', H);
    }
  }
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => onResize(),[]);


  let cooldown = false;
  const exec = (fn) => {
    return Promise.resolve().then(() => {
      if (!cooldown) {
        cooldown = true;
        setTimeout(() => cooldown = false, 100);
        return fn();
      }
    })
  } 
  let lastScroll;
  let dir = 0;
  function onScroll(e) {
    let delta = lastScroll - e.srcElement.scrollTop;
    lastScroll = e.srcElement.scrollTop;
    if(delta < 0) dir = 1; else dir = 0; 
    const msgs = [...list.current.querySelectorAll('.message')];
    const current = msgs.findLast(el => (el.offsetTop < e.srcElement.scrollTop + H - 20));
    const position = list.current.scrollHeight - H - e.srcElement.scrollTop;
    setPosB(position);
    if(e.srcElement.scrollTop < 10) {
      exec(loadPrevious);
    }else {
      if(current){
        const id = current.getAttribute('data-id');
        if(dir == 1) {
          console.log('deleteBefore');
          deleteBefore(id);
        }
      }
    }
  }

  useEffect(() => {
    list.current.addEventListener('scroll', onScroll);
    return () => list.current.removeEventListener('scroll', onScroll);
  }, [H]);
  
  useEffect(() => {
    list.current.scrollTo(0, list.current.scrollHeight - H - posB);
  }, [messages, H]);

  watchMessages((m) => setMessages(m || []));

  return html`
    <div class="message-list" ref=${list}>
      ${messages.map(msg => html`
        <${Message} 
          class=${msg.private ? ['private'] : []} 
          data-id=${msg.id}
          author=${msg.user?.name || 'Guest'}
          content=${msg.message}
          date=${msg.createdAt}
        /> 
      `)}
    </div>
  `;
}
