import { h, createContext } from 'preact';
import {
  useRef, useState, useCallback, useEffect, useContext,
} from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useStream } from '../../contexts/stream';
import * as messageService from '../../services/messages';
import { uploadMany } from '../../services/file';
import { fromDom } from './serializer';
import { useMessage } from '../../hooks/useMessage';

const Context = createContext({
  input: {},
});

function findScope(element) {
  let currentElement = element;
  while (currentElement !== null) {
    if (currentElement.hasAttribute?.('scope')) {
      return { el: currentElement, scope: currentElement.getAttribute('scope') };
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}

export const InputContext = (args) => {
  const { children, mode = 'default', messageId = null } = args;
  const dispatch = useDispatch();
  const [stream] = useStream();
  const [currentText, setCurrentText] = useState('');
  const [scope, setScope] = useState('');
  const [scopeContainer, setScopeContainer] = useState(null);
  const files = useSelector((state) => state.files);
  const filesAreReady = !files || files.every((f) => f.status === 'ok');
  const message = useMessage(messageId);

  const input = useRef();
  const fileInput = useRef(null);
  const [range, setRange] = useState(null);

  const getRange = useCallback(() => {
    const r = document.getSelection().getRangeAt(0);
    if (input.current.contains(r.commonAncestorContainer)) {
      return r;
    }
    return range;
  }, [range]);

  const updateRange = useCallback(() => {
    const r = getRange();
    if (!r) return;
    setRange(r);
    if (r.endContainer.nodeName === '#text') {
      setCurrentText(r.endContainer.textContent.slice(0, r.endOffset));
    } else {
      setCurrentText('');
    }
    const { el, scope: s } = findScope(r.commonAncestorContainer);
    if (s !== scope) {
      setScope(s);
    }
    setScopeContainer(el);
  }, [getRange, setRange, scope, setScope, setCurrentText, setScopeContainer]);

  const onPaste = useCallback((event) => {
    const cbData = (event.clipboardData || window.clipboardData);
    if (cbData.files?.length > 0) {
      event.preventDefault();
      dispatch(uploadMany(stream.id, cbData.files));
    }

    const range = getRange();
    range.deleteContents();

    cbData.getData('text').split('\n').reverse().forEach((line, idx) => {
      if (idx) range.insertNode(document.createElement('br'));
      range.insertNode(document.createTextNode(line));
    });
    document.getSelection().collapseToEnd();
    event.preventDefault();
    event.stopPropagation();
  }, [getRange, dispatch, stream]);

  const onFileChange = useCallback((e) => {
    if (e.target.files?.length > 0) {
      const { files } = e.target;
      dispatch(uploadMany(stream.id, files));
      e.target.value = '';
    }
  }, [dispatch, stream]);

  const onInput = useCallback(() => {
    updateRange();
  }, [updateRange]);

  const focus = useCallback((e) => {
    if (!input.current) return;
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
    if (!filesAreReady) return;
    const payload = fromDom(input.current);
    if (payload.type === 'message:create' && mode === 'edit') {
      payload.type = 'message:update';
      payload.id = messageId;
      payload.clientId = message.clientId;
    }
    payload.attachments = [...files.filter((f) => f.streamId === stream.id)];
    if (payload.flat.length === 0 && payload.attachments.length === 0) return;
    payload.channelId = stream.channelId;
    payload.parentId = stream.parentId;

    dispatch.actions.files.clear(stream.id);
    dispatch(messageService.send(stream, payload));
    if (mode === 'default') {
      input.current.innerHTML = '';
      focus(e);
    } else {
      dispatch.actions.messages.editClose(messageId);
    }
  }, [input, stream, focus, dispatch,
    filesAreReady, files, messageId, mode]);

  const wrapMatching = useCallback((regex, wrapperTagName) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      // eslint-disable-next-line no-console
      console.warn('No text selected.');
      return;
    }
    const range = selection.getRangeAt(0);
    const { endContainer } = range;

    if (endContainer.nodeType !== Node.TEXT_NODE) {
      // eslint-disable-next-line no-console
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
    const here = document.createTextNode(textContent || '\u00A0');
    documentFragment.appendChild(here);
    documentFragment.appendChild(document.createTextNode(afterText));
    parentNode.replaceChild(documentFragment, endContainer);
    const sel = document.getSelection();
    const r = document.createRange();
    r.setEnd(here, 0);
    r.setStart(here, 0);
    sel.removeAllRanges();
    sel.addRange(r);
    updateRange();
  }, [updateRange]);

  const replace = useCallback((regex, text = '') => {
    const range = getRange();
    const node = range.endContainer;
    const original = node.textContent;
    const replacement = original.slice(0, range.endOffset).replace(regex, text);
    node.textContent = replacement + original.slice(range.endOffset);
    const s = document.getSelection();
    const r = document.createRange();
    r.setStart(node, replacement.length);
    r.setEnd(node, replacement.length);
    s.removeAllRanges();
    s.addRange(r);
  }, [getRange]);

  const insert = useCallback((domNode) => {
    const range = getRange();
    range.deleteContents();
    range.insertNode(domNode);
    range.collapse();
  }, [getRange]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && scope === 'root') {
      return send(e);
    }
    dispatch.methods.typing.notify(stream);
    updateRange();
  }, [dispatch, send, updateRange, scope, stream]);

  const addFile = useCallback(() => {
    fileInput.current.click();
  }, [fileInput]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateRange);
    return () => document.removeEventListener('selectionchange', updateRange);
  }, [updateRange]);

  useEffect(() => {
    const { current } = input;
    current.addEventListener('keydown', onKeyDown);
    current.addEventListener('input', onInput);
    return () => {
      current.removeEventListener('input', onInput);
      current.removeEventListener('keydown', onKeyDown);
    };
  }, [input, onInput, onKeyDown]);

  const api = {
    mode,
    messageId,
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
    addFile,

    send,
    getRange,
    insert,
    focus,
  };

  return (
    <Context.Provider value={api}>
      {children}
    </Context.Provider>
  );
};

export const useInput = () => {
  const context = useContext(Context);
  return context;
};
