import { h, render } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import '../core/registerSw';
import { Login } from './login';

const Secured = lazy(() => import('./secured'));

export const App = () => {
  const [height, setHeight] = useState(window.visualViewport.height);

  useEffect(() => {
    const updateHeight = (e) => {
      setHeight(e.target.height);
    }
    window.visualViewport.addEventListener('resize', updateHeight);
    return () => window.visualViewport.removeEventListener('resize', updateHeight);
  }, [setHeight]);

  return (
    <Login height={height}>
      <Suspense fallback={<div>loading secured page...</div>}>
        <Secured />
      </Suspense>
    </Login>
  );
}

render(<App />, document.getElementById('root'));
