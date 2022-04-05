import './CommandMenu.css';
import Quill from 'quill';
import Fuse from 'fuse.js';
import {
  html, useState, useEffect, useRef, createCooldown,
} from '../../utils.js';
import Temp from './TempBlot';

const Module = Quill.import('core/module');
Quill.register('formats/temp', Temp);

const v = false;
let show = () => {};
let up = () => {};
let down = () => {};
const focus = () => {};

export class MenuSelector extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.quill = quill;
    this.start = 0;

    quill.keyboard.addBinding({
      key: 186,
      shiftKey: true,
    }, this.trigger);

    quill.keyboard.addBinding({
      key: 38,
    }, () => up());

    quill.keyboard.addBinding({
      key: 40,
    }, () => down());

    quill.keyboard.addBinding({
      key: 'enter',
      format: {temp: false},
      handler: this.submit,
    });

    quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return; 
      const sel = quill.getSelection();
      console.log(this.start, sel, sel.index - this.start);
      console.log(quill.getText(this.start, sel.index - this.start));
      console.log({delta, oldDelta});

    });
  }

  submit = (range, context) => {
    console.log('submit');
    return false;
  };

  trigger = (range, context) => {
    if (range.length > 0) {
      this.quill.deleteText(range.index, range.length, Quill.sources.USER);
    }
    this.quill.insertText(range.index, ':', {temp: true}, Quill.sources.USER);
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    this.start = range.index;
    //show(true);
  };

  onTextChange = () => {

  };

  onSelectionChange = () => {
    show(false);
    this.quill.enable();
    this.quill.off('selection-change', this.onSelectionChange);
    this.quill.off('text-change', this.onTextChange);
    this.quill.focus();
  };
}

export const Menu = () => {
  const input = useRef(null);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  show = (v) => {
    setVisible(v);
    setTimeout(() => input.current.focus(), 1);
  }
  up = () => setSelected(selected + 1);
  down = () => setSelected(selected > 0 ? selected - 1 : selected);

  const press = (e) => {
    if (e.keyCode === 38) {
      up();
    }
    if (e.keyCode === 40) {
      down();
    }
    if (e.keyCode === 13) {
      console.log(fuse.search(search, {limit: 5}));
      console.log(selected);
      console.log(fuse.search(search, {limit: 5})[selected]);
    }
  };

  useEffect(() => {
    input.current.addEventListener('keydown', press);
    return () => input.current.removeEventListener('keydown', press);
  }, [input]);

  const fuse = new Fuse(EMOJI, {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.1,
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: false,
    ignoreFieldNorm: false,
    fieldNormWeight: 1,
    keys: [
      'name',
    ],
  });

  const change = (e) => {
    setSearch(e.target.value);
    console.log('change', e);
  }

  console.log(fuse.search(search, {limit: 5}));
  return html`
    <div class='command-menu ${visible ? '' : 'hidden'}'>
      <input value=${search} onInput=${change} ref=${input}/>
      <ul>
        ${fuse.search(search, {limit: 5}).map((e, idx) => html`
          <li class=${idx === selected ? 'selected' : ''}>
            ${String.fromCodePoint(parseInt(e.item.unicode, 16))} ${e.item.shortname}
          </li>
        `)}
      </ul>
    </div>
  `;
};
