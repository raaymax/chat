import { h, createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const Context = createContext({
  stream: {
    channelId: null,
    parentId: null,
  },
  messages: [],
  selected: null,
  hovered: [null, () => {}],
});

export const ConversationContext = ({children, value}) => {
  const hovered = useState(false);
  return (
    <Context.Provider value={{...value, hovered}}>
      {children}
    </Context.Provider>
  );
};

export const useHovered = () => {
  const context = useContext(Context);
  return context.hovered;
}

export const useStream = () => {
  const context = useContext(Context);
  return context.stream;
}

export const useMessageList = () => {
  const context = useContext(Context);
  return context.messages;
}

export const useSelectedMessage = () => {
  const context = useContext(Context);
  return context.selected;
}
