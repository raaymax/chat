import { html, useEffect, useRef } from '../utils.js';
import { build } from '../formatter.js';
import { Info } from './info.js';
import { send as sendMessage } from '../services/messages.js';
import { notifyTyping } from '../services/typing';

Quill.register('modules/emoji', QuillEmoji);

let submit = () => {};
let toggle = () => {};
let quillFocus = () => {};

const send = () => submit();
const toggleToolbar = () => toggle();
const focus = () => quillFocus();

function initQuill() {
  const quill = new Quill('#input', {
    theme: 'snow',
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike', 'link'], ['emoji'], [{ list: 'ordered' }, { list: 'bullet' }], ['blockquote', 'code', 'code-block'], ['clean']].flat(),
      'emoji-toolbar': true,
      'emoji-shortname': true,
      keyboard: {
        bindings: {
          submit: {
            key: 'enter',
            handler() {
              if (navigator.userAgentData.mobile) {
                return true;
              }
              submit();
              return false;
            },
          },
        },
      },
    },
  });

  quill.focus();
  quillFocus = () => quill.focus();

  submit = () => {
    sendMessage(build(quill.getContents()));
    setTimeout(() => {
      document.getElementById('scroll-stop').scrollIntoView();
    }, 1);
    quill.setContents([]);
    quill.focus();
  };
  let visible = true;
  toggle = () => {
    if (visible) {
      document.getElementsByClassName('ql-toolbar')[0].style = 'display: none;';
    } else {
      document.getElementsByClassName('ql-toolbar')[0].style = '';
    }
    visible = !visible;
    quill.focus();
  };
}

export const Input = () => {
  const input = useRef(null);
  useEffect(() => initQuill(), []);
  useEffect(() => toggleToolbar(), []);
  useEffect(() => {
    input.current.addEventListener('keydown', notifyTyping);
    return () => input.current.removeEventListener('keydown', notifyTyping);
  }, []);
  return html`
    <div class="input-container" onclick=${focus} >
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
};
