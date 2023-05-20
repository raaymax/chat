import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import '../core/registerSw';
import { Login } from './login';

const Secured = lazy(() => import('./secured'));

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export const App = () => (
  <Login>
    <Suspense fallback={<div>loading secured page...</div>}>
      <Secured />
    </Suspense>
  </Login>
)

render(<App />, document.getElementById('root'));
