import {html, useEffect} from '/js/utils.js';
import {build} from '/js/formatter.js';
import {getChannel} from '/js/store/channel.js'
import con from '/js/connection.js';

Quill.register("modules/emoji", QuillEmoji);

function initQuill() {
  var quill = new Quill('#input', {
    theme: 'snow',
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike', 'link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['blockquote', 'code', 'code-block'], ['image'],['clean']],
      "emoji-toolbar": true,
      "emoji-textarea": true,
      "emoji-shortname": true,
      keyboard: {
        bindings: {
          submit: {
            key: 'enter', 
            handler: function(range, context) {
              const msg = build(this.quill.getContents());
              msg.channel = getChannel();
              console.log('msg', JSON.stringify(msg, null, 4));
              if(msg) con.req(msg);
              this.quill.setContents([]);
            }
          }
        }
      },
    }
  });
  quill.focus();
}

export const Input = (props) => {
  useEffect(() => initQuill(), []);
  return html`
    <div class="input-container">
      <div id="input"></div>
    </div>     
  `;
}
