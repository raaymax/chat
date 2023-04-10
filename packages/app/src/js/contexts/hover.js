import { h, createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';

const Context = createContext({
  hovered: [null, () => {}],
});

export const HoverContext = ({children}) => {
  const hovered = useState(false);
  return (
    <Context.Provider value={hovered}>
      {children}
    </Context.Provider>
  );
};

export const useHovered = () => useContext(Context)
