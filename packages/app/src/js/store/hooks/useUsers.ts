import { useMemo } from "react";
import { useSelector } from "./useSelector";

export const useUsers = () => {
  const users = useSelector((state) => state.users);
  return useMemo(() => Object.values(users), [users]);
};
