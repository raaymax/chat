import Quill from 'quill';
const Inline = Quill.import('blots/inline');

class Temp extends Inline {
  static create() {
    return super.create();
  }

  static formats() {
    return true;
  }

  optimize(context) {
    super.optimize(context);
    if (this.domNode.tagName !== this.statics.tagName[0]) {
      this.replaceWith(this.statics.blotName);
    }
  }
}
Temp.blotName = 'temp';
Temp.tagName = ['span'];

export default Temp;
