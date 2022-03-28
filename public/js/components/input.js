import {html, useEffect, useRef} from '/js/utils.js';
import {build} from '/js/formatter.js';
import {Info} from '/js/components/info.js';
import {getChannel} from '/js/store/channel.js'
import con from '/js/connection.js';
import {send as sendMessage} from '/js/services/messages.js';

Quill.register("modules/emoji", QuillEmoji);

let submit = () => {};
let toggle = () => {};

let cooldown = false;
let queue = false;

const send = () => submit();
const toggleToolbar = () => toggle();

function notifyTyping(){
  if(cooldown){
    queue = true;
    return;
  }
  cooldown = true;
  queue = false;
  con.send({op: {type: 'typing'}});
  setTimeout(() => {
    cooldown = false;
    if(queue) {
      notifyTyping();
    }
  }, 1000);
};

function initQuill() {
  var quill = new Quill('#input', {
    theme: 'snow',
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike', 'link'], ['emoji'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['blockquote', 'code', 'code-block'],['clean']].flat(),
      "emoji-toolbar": true,
      "emoji-shortname": true,
      keyboard: {
        bindings: {
          submit: {
            key: 'enter', 
            handler: function(range, context) {
              if(navigator.userAgentData.mobile){
                return true;
              }
              submit();
              return false;
            }
          }
        }
      },
    }
  });

  quill.focus();

  submit = function submit() {
    sendMessage(build(quill.getContents()));
    setTimeout(() => {
      document.getElementById('scroll-stop').scrollIntoView();
    }, 1)
    quill.setContents([]);
    quill.focus();
  }
  let visible = true;
  toggle = function toggle() {
    if(visible){
      document.getElementsByClassName('ql-toolbar')[0].style = 'display: none;';
    }else{
      document.getElementsByClassName('ql-toolbar')[0].style = '';
    }
    visible = !visible;
    quill.focus();
  }
}


export const Input = (props) => {
  const input = useRef(null)
  useEffect(() => initQuill(), []);
  useEffect(() => toggleToolbar(), []);
  useEffect(() => {
    input.current.addEventListener('keydown', notifyTyping);
    return () => input.current.removeEventListener('keydown', notifyTyping);
  }, []);
  return html`
    <div class="input-container">
      <div id="input" ref=${input}></div>
      <div class='actionbar'>
        <${Info} />
        <div class='action' onclick=${toggleToolbar}>
          <i class="fa-solid fa-paragraph"></i>
        </div>
        <div class='space'></div>
        <div class='action green' onclick=${send}>
          <i class="fa-solid fa-paper-plane" />
        </div>
      </div>
    </div>     
  `;
}

