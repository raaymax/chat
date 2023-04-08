import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export const VisibleViewport = ({ children }) => {
  const [height, setHeight] = useState(window.visualViewport.height);

  useEffect(() => {
    const updateHeight = (e) => {
      setHeight(e.target.height);
    }
    window.visualViewport.addEventListener('resize', updateHeight);
    return () => window.visualViewport.removeEventListener('resize', updateHeight);
  }, [setHeight]);

  return (
    <div style={{height: `${height}px`, width: '100%'}}>
      {children}
    </div>
  );
};
