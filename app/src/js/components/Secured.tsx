import { useEffect } from 'react';
import '../setup';
import { client } from '../core';
import StoreProvider from '../store/components/provider';
import { useUser } from './contexts/useUser';
import { Router } from './Router';
import { ThemeSelectorProvider } from './contexts/theme';
import { TooltipBox } from './atoms/Tooltip';
import { TooltipProvider } from './contexts/tooltip';

const Secured = () => {
  const user = useUser();
  useEffect(() => {
    client.emit('auth:user', user);
  }, [user]);

  return (
    <StoreProvider>
      <ThemeSelectorProvider>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </ThemeSelectorProvider>
    </StoreProvider>
  );
};

export default Secured;
