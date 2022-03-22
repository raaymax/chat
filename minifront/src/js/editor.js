import {build} from '/js/formatter.js';
import {getChannel} from '/js/store/channel.js'
import con from '/js/connection.js';
import {toJSON} from '/js/domToJson.js';

Quill.register("modules/emoji", QuillEmoji);
export function initQuill() {
  var quill = new Quill('#input', {
    theme: 'snow',
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'link'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['blockquote', 'code', 'code-block'], ['image'],['clean']],
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
              if(msg) con.send(msg);
              this.quill.setContents([]);
            }
          }
        }
      },
    }
  });
  quill.focus();
}

