import { useMemo } from 'react';
import { useSelector } from './useSelector';

export const useMessage = (id: string | undefined | null) => {
  const messages = useSelector((state) => state.messages.data);
  return useMemo(
    () => {
      if (!id) return null;
      return messages.find((m) => m.id === id || m.clientId === id) || null;
    },
    [messages, id],
  );
};
