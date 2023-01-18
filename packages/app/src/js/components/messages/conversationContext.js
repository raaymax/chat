import { h, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const Context = createContext({
  hovered: [null, () => {}],
});

export const ConversationContext = ({children}) => {
  const hovered = useState(false);
  return (
    <Context.Provider value={{hovered}}>
      {children}
    </Context.Provider>
  );
};

export const useHovered = () => {
  const context = useContext(Context);
  return context.hovered;
}
