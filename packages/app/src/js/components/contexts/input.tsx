import React, {
  useRef, useState, useCallback, useEffect, createContext, MutableRefObject,
} from 'react';
import { useDispatch, useSelector, useMessage, useMethods, useActions } from '../../store';
import { useStream } from './useStream';
import * as messageService from '../../services/messages';
import { uploadMany } from '../../services/file';
import { fromDom } from '../../serializer';

export type InputContextType = {
  mode: string;
  messageId: string | null;
  input: MutableRefObject<HTMLDivElement | null>;
  fileInput: MutableRefObject<HTMLInputElement| null>;
  onPaste: (e: any) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onInput: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentText: string;
  scope: string;
  scopeContainer: HTMLElement | undefined;
  replace: (regex: RegExp, text?: string) => void;
  wrapMatching: (regex: RegExp, wrapperTagName: string) => void;
  addFile: () => void;
  send: (e: any) => void;
  getRange: () => Range;
  insert: (domNode: HTMLElement) => void;
  focus: (e?: Event) => void;
};

export const InputContext = createContext<InputContextType | null>(null);

function findScope(element: HTMLElement | null): { el: HTMLElement, scope: string } | null {
  let currentElement = element;
  while (currentElement !== null) {
    const scope = currentElement.getAttribute?.('data-scope')
    if (typeof scope === 'string') {
      return { el: currentElement, scope };
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}


type InputContextProps = {
  children: React.ReactNode;
  mode?: string;
  messageId?: string;
};

export const InputProvider = (args: InputContextProps) => {
  const { children, mode = 'default', messageId = null } = args;
  const dispatch = useDispatch();
  const methods = useMethods();
  const actions = useActions();
  const [stream] = useStream();
  const [currentText, setCurrentText] = useState('');
  const [scope, setScope] = useState<string>('');
  const [scopeContainer, setScopeContainer] = useState<HTMLElement>();
  //FIXME: files as any
  const files = useSelector((state) => state.files);
  const filesAreReady = !files || files.every((f) => f.status === 'ok');
  const message = useMessage(messageId);

  const input = useRef<HTMLDivElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [range, setRange] = useState<Range>(document.createRange());

  const getDefaultRange = useCallback((): Range => {
    if(!input.current) throw new Error('Input ref is not set');
    const r = document.createRange();
    r.setStart(input.current, 0);
    r.setEnd(input.current, 0);
    return r;
  }, [input]);

  const getRange = useCallback((): Range => {
    if(!input.current) throw new Error('Input ref is not set');
    const selection = document.getSelection();
    if(!selection || selection.type === 'None') {
      return getDefaultRange();
    }
    const r = selection.getRangeAt(0);
    if (input.current.contains(r.commonAncestorContainer)) {
      return r;
    }
    return range || getDefaultRange();
  }, [range, getDefaultRange]);

  const updateRange = useCallback(() => {
    const r = getRange();
    if (!r) return;
    setRange(r);
    if (r.endContainer.nodeName === '#text') {
      setCurrentText(r.endContainer.textContent?.slice(0, r.endOffset) ?? '');
    } else {
      setCurrentText('');
    }
    const { el, scope: s } = findScope(r.commonAncestorContainer as HTMLElement) || {};
    if (s && s !== scope) {
      setScope(s);
    }
    if(el) setScopeContainer(el);
  }, [getRange, setRange, scope, setScope, setCurrentText, setScopeContainer]);

  const onPaste = useCallback((event: ClipboardEvent) => {
    // FIXME: window as any
    const cbData = (event.clipboardData || (window as any).clipboardData);
    if (cbData.files?.length > 0) {
      event.preventDefault();
      dispatch(uploadMany(stream.id, cbData.files));
    }

    const range = getRange();
    range.deleteContents();

    cbData.getData('text').split('\n').reverse().forEach((line: string, idx: number) => {
      if (idx) range.insertNode(document.createElement('br'));
      range.insertNode(document.createTextNode(line));
    });
    document.getSelection()?.collapseToEnd();
    event.preventDefault();
    event.stopPropagation();
  }, [getRange, dispatch, stream]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target.files?.length ?? 0) > 0) {
      const { files } = e.target;
      dispatch(uploadMany(stream.id, files));
      e.target.value = '';
    }
  }, [dispatch, stream]);

  const onInput = useCallback(() => {
    updateRange();
  }, [updateRange]);

  const focus = useCallback((e?: Event) => {
    if (!input.current) return;
    input.current.focus();
    if (!range) return;
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [input, range]);

  //FIXME: e as any
  const send = useCallback((e: any) => {
    if (!input.current) return;
    if (!filesAreReady) return;
    // FIXME: payload as any
    const payload: any = fromDom(input.current);
    if (payload.type === 'message:create' && mode === 'edit') {
      payload.type = 'message:update';
      payload.id = messageId;
      payload.clientId = message?.clientId;
    }
    //FIXME: files as any
    payload.attachments = [...files.filter((f: any) => f.streamId === stream.id)];
    if (payload.flat.length === 0 && payload.attachments.length === 0) return;
    payload.channelId = stream.channelId;
    payload.parentId = stream.parentId;

    actions.files.clear(stream.id);
    dispatch(messageService.send(stream, payload));
    if (mode === 'default') {
      input.current.innerHTML = '';
      focus(e);
    } else {
      actions.messages.editClose(messageId);
    }
  }, [actions, input, stream, focus, dispatch,
    filesAreReady, files, messageId, mode, message]);

  const wrapMatching = useCallback((regex: RegExp, wrapperTagName: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
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
    let textContent = endContainer.textContent || '';
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
    parentNode?.replaceChild(documentFragment, endContainer);
    const sel = document.getSelection();
    const r = document.createRange();
    r.setEnd(here, 0);
    r.setStart(here, 0);
    sel?.removeAllRanges();
    sel?.addRange(r);
    updateRange();
  }, [updateRange]);

  const replace = useCallback((regex: RegExp, text: string = '') => {
    const range = getRange();
    const node = range.endContainer;
    const original = node.textContent ?? '';
    const replacement = original.slice(0, range.endOffset).replace(regex, text);
    node.textContent = replacement + original.slice(range.endOffset);
    const s = document.getSelection();
    const r = document.createRange();
    r.setStart(node, replacement.length);
    r.setEnd(node, replacement.length);
    s?.removeAllRanges();
    s?.addRange(r);
  }, [getRange]);

  const insert = useCallback((domNode: HTMLElement) => {
    const range = getRange();
    range.deleteContents();
    range.insertNode(domNode);
    range.collapse();
  }, [getRange]);

  interface KeyboardEvent {
    key: string;
    shiftKey: boolean;
  }

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && scope === 'root') {
      return send(e as any);
    }
    methods.typing.notify({channelId: stream.channelId, parentId: stream.parentId});
    updateRange();
  }, [methods, send, updateRange, scope, stream]);

  const addFile = useCallback(() => {
    fileInput.current?.click();
  }, [fileInput]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateRange);
    return () => document.removeEventListener('selectionchange', updateRange);
  }, [updateRange]);

  useEffect(() => {
    const { current } = input;
    if(!current) return;
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
    <InputContext.Provider value={api}>
      {children}
    </InputContext.Provider>
  );
};

