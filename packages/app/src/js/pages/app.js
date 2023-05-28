import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import '../core/registerSw';
import { Register } from './register/register';
import { Login } from './login/login';

const Secured = lazy(() => import('./secured'));

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

render(<App />, document.getElementById('root'));
