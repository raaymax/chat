import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import '../core/registerSw';
import { Login } from './login';
import { VisibleViewport } from '../components/VisibleViewport/VisibleViewport';

const Secured = lazy(() => import('./secured'));

export const App = () => (
  <VisibleViewport>
    <Login>
      <Suspense fallback={<div>loading secured page...</div>}>
        <Secured />
      </Suspense>
    </Login>
  </VisibleViewport>
)

render(<App />, document.getElementById('root'));
