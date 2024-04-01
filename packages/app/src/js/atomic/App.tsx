import { createRoot } from 'react-dom/client';
import { Suspense, lazy } from 'react';
import '../core/registerSw';
import { Register } from '../atomic/pages/Register';
import { Login } from '../atomic/pages/Login';

const Secured = lazy(() => import('./Secured'));

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export const App = () => {
  const url = new URL(window.location);
  const {hash} = url;
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

const root = createRoot(document.getElementById('root'));
root.render(<App />);
