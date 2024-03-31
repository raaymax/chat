import {
  useState, useContext, useCallback, createContext,
} from 'react';

const Context = createContext<[string | null, (val: string | null) => void] | undefined>(undefined);

type HoverContextProps = {
  children: React.ReactNode;
};

export const HoverContext = ({ children }: HoverContextProps) => {
  const hovered = useState<string|null>(null);
  return (
    <Context.Provider value={hovered}>
      {children}
    </Context.Provider>
  );
};

export const useHovered = () => {
  const state = useContext(Context);
  if (!state) throw new Error('useHovered must be used within a HoverContext');
  return state;
}

export const useHoverCtrl = (id: string) => {
  const [hovered, setHovered] = useHovered();

  const onEnter = useCallback(() => {
    setHovered(id);
  }, [setHovered, id]);

  const toggleHovered = useCallback(() => {
    // FIXME: useIsMobile() hook maybe?
    if (!(navigator as any).userAgentData.mobile) return;
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

  return { onEnter, onLeave, toggleHovered };
};
