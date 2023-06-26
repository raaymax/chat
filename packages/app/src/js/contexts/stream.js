import { h, createContext } from 'preact';
import { useContext, useMemo, useEffect} from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { loadMessages } from '../services/messages';

const Context = createContext([{}, () => ({})]);

export const StreamContext = ({ children, value }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useStream = () => {
  const [stream, setStream] = useContext(Context);

  return [
    stream,
    setStream,
  ];
};

export const useMessages = () => {
  const dispatch = useDispatch();
  const [stream] = useContext(Context);
  const messages = useSelector((state) => state.messages.data);

  useEffect(() => {
    dispatch(loadMessages(stream));
    dispatch.methods.progress.loadProgress(stream);
  }, [dispatch, stream]);

  return useMemo(
    () => messages
      .filter((m) => m.channelId === stream.channelId
    && (
      ((!stream.parentId && !m.parentId) || m.parentId === stream.parentId)
    || (!stream.parentId && m.parentId === m.id))),
    [stream, messages],
  );
};
