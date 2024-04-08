import { useCallback } from 'react';
import { useHovered } from './useHovered';

export const useHoverCtrl = (id?: string) => {
  const [hovered, setHovered] = useHovered();

  const onEnter = useCallback(() => {
    setHovered(id ?? null);
  }, [setHovered, id]);

  const toggleHovered = useCallback(() => {
    // FIXME: useIsMobile() hook maybe?
    if (!(navigator as any).userAgentData.mobile) return;
    if (hovered !== id) {
      setHovered(id ?? null);
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
