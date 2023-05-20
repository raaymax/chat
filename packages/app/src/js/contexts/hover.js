import { h, createContext } from 'preact';
import { useState, useContext, useCallback } from 'preact/hooks';

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

export const useHoverCtrl = (id) => {
  const [hovered, setHovered] = useHovered()

  const onEnter = useCallback(() => {
    setHovered(id);
  }, [setHovered, id]);

  const toggleHovered = useCallback(() => {
    if (!navigator.userAgentData.mobile) return;
    if (hovered !== id) {
      setHovered(id);
    } else {
      setHovered(null);
    }
  }, [hovered, setHovered, id]);

  const onLeave = useCallback(() => {
    if (hovered === id) {
      setHovered(null);
    }
  }, [setHovered, hovered, id]);

  return {onEnter, onLeave, toggleHovered}
}
