import { h, createContext } from 'preact';
import {
  useRef, useState, useCallback, useEffect, useContext,
} from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { useStream } from './stream';
import { sendFromDom } from '../services/messages';

const Context = createContext({
  hovered: [null, () => {}],
  input: {},
});

function findScope(element) {
  let currentElement = element;
  while (currentElement !== null) {
    if (currentElement.hasAttribute?.('scope')) {
      return {el:currentElement, scope: currentElement.getAttribute('scope')};
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}

export const ConversationContext = ({children}) => {
  const hovered = useState(false);
  const dispatch = useDispatch();
  const [stream] = useStream();
  const [currentText, setCurrentText] = useState('');
  const [scope, setScope] = useState('');
  const [scopeContainer, setScopeContainer] = useState(null);

  const input = useRef();
  const fileInput = useRef(null);
  const [range, setRange] = useState(null);

  const updateRange = useCallback(() => {
    const r = document.getSelection().getRangeAt(0);
    if (input.current.contains(r.commonAncestorContainer)) {
      if (r.endContainer.nodeName === '#text') {
        setCurrentText(r.endContainer.textContent.slice(0, r.endOffset));
      } else {
        setCurrentText('');
      }
      const {el, scope: s} = findScope(r.commonAncestorContainer);
      if (s !== scope) {
        setScope(s);
      }
      setScopeContainer(el);
      setRange(r);
    }
  }, [input, setRange, scope, setScope, setCurrentText, setScopeContainer])

  const onPaste = useCallback(() => {}, []);
  const onFileChange = useCallback(() => {}, []);
  const onInput = useCallback(() => {
    updateRange();
  }, [updateRange]);

  const focus = useCallback((e) => {
    input.current.focus();
    if (!range) return;
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [input, range]);

  const send = useCallback((e) => {
    dispatch(sendFromDom(stream, input.current));
    input.current.innerHTML = '';
    focus(e);
  }, [input, stream, focus, dispatch]);

  const replace = useCallback((regex, text = '') => {
    const node = range.endContainer
    const original = node.textContent;
    const replacement = original.slice(0, range.endOffset).replace(regex, text);
    node.textContent = replacement + original.slice(range.endOffset);
    const s = document.getSelection();
    const r = document.createRange();
    r.setStart(node, replacement.length);
    r.setEnd(node, replacement.length);
    s.removeAllRanges();
    s.addRange(r);
    setRange(r);
  }, [range, setRange]);

  const wrapMatching = useCallback((regex, wrapperTagName) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      console.warn('No text selected.');
      return;
    }
    const range = selection.getRangeAt(0);
    const { endContainer } = range;

    if (endContainer.nodeType !== Node.TEXT_NODE) {
      console.warn('End container is not a text node.');
      return;
    }

    const { parentNode } = endContainer;
    let { textContent } = endContainer;
    const afterText = textContent.slice(range.endOffset);
    textContent = textContent.slice(0, range.endOffset);
    const documentFragment = document.createDocumentFragment();

    const match = regex.exec(textContent);

    if (match === null) return;
    const matchedText = match[1] || match[0];
    const matchedIndex = match.index;
    documentFragment.appendChild(document.createTextNode(textContent.substring(0, matchedIndex)));
    const wrapperElement = document.createElement(wrapperTagName);
    wrapperElement.appendChild(document.createTextNode(matchedText));
    documentFragment.appendChild(wrapperElement);
    textContent = textContent.substring(matchedIndex + match[0].length);
    const here = document.createTextNode(textContent || '\u00A0')
    documentFragment.appendChild(here);
    documentFragment.appendChild(document.createTextNode(afterText));
    parentNode.replaceChild(documentFragment, endContainer);
    const sel = document.getSelection();
    const r = document.createRange();
    r.setEnd(here, 1);
    r.setStart(here, 1);
    sel.removeAllRanges();
    sel.addRange(r);
    updateRange();
  }, [updateRange]);

  const insert = useCallback((domNode) => {
    const r = document.getSelection().getRangeAt(0);
    r.deleteContents();
    r.insertNode(domNode);
    r.collapse();
    setRange(r);
  }, [setRange]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && scope === 'root') {
      return send(e);
    }
    updateRange();
  }, [send, updateRange, scope]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateRange);
    return () => document.removeEventListener('selectionchange', updateRange);
  }, [updateRange]);

  useEffect(() => {

  }, [range]);

  useEffect(() => {
    const {current} = input;
    current.addEventListener('keydown', onKeyDown);
    current.addEventListener('input', onInput);
    return () => {
      current.removeEventListener('input', onInput);
      current.removeEventListener('keydown', onKeyDown);
    }
  }, [input, onInput, onKeyDown]);

  const api = {
    hovered,
    input,
    fileInput,
    onPaste,
    onKeyDown,
    onInput,
    onFileChange,
    currentText,
    scope,
    scopeContainer,
    replace,
    wrapMatching,

    send,
    range,
    insert,
    focus,
  }

  return (
    <Context.Provider value={api}>
      {children}
    </Context.Provider>
  );
};

export const useInput = () => {
  const context = useContext(Context);
  return context;
}

export const useHovered = () => {
  const context = useContext(Context);
  return context.hovered;
}
