import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const Context = createContext([{}, () => {}]);

export const StreamContext = ({children, value}) => (
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
}
