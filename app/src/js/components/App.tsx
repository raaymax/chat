import { createRoot } from 'react-dom/client';
import { Suspense, lazy } from 'react';
import { Register } from './pages/Register';
import { Login } from './pages/Login';

declare global {
  interface Navigator {
    virtualKeyboard: {
      overlaysContent: boolean;
    };
  }
}

const Secured = lazy(() => import('./Secured'));

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export const App = () => {
  const url = new URL(window.location.toString());
  const { hash } = url;
  if (hash.startsWith('#/invite')) {
    return <Register />;
  }

  return (
    <Login>
      <Suspense fallback={<div>loading secured page...</div>}>
        <Secured />
      </Suspense>
    </Login>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);