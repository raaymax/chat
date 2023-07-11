import { useMemo } from "preact/hooks";
import { useSelector } from "react-redux";

export const useUsers = () => {
  const users = useSelector((state) => state.users);
  return useMemo(() => Object.values(users), [users]);
};
