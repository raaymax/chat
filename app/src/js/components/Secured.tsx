import { useEffect } from "react";
import "../setup";
import { client } from "../core";
import StoreProvider from "../store/components/provider";
import { useLoggedUserId } from "./contexts/useLoggedUserId";
import { Router } from "./Router";
import { TooltipProvider } from "./contexts/tooltip";

const Secured = () => {
  const user = useLoggedUserId();
  useEffect(() => {
    client.emit("auth:user", user);
  }, [user]);

  return (
    <StoreProvider>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </StoreProvider>
  );
};

export default Secured;
