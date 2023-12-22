import { useMemo } from 'preact/hooks';
import { useSelector } from 'react-redux';

export const useMessage = (id) => {
  const messages = useSelector((state) => state.messages.data);
  return useMemo(
    () => {
      if (!id) return null;
      return messages.find((m) => m.id === id || m.clientId === id) || null
    },
    [messages, id],
  );
};
