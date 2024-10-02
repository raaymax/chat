import { useState } from 'react';
import { cn, ClassNames } from '../../utils';

interface TooltipProps {
  children: React.ReactNode;
  className?: ClassNames;
  text: string;
}

export const Tooltip = ({ children, text, className = '' }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn('tooltip-container', className)}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className='tooltip'
          style={{
            position: 'absolute',
            zIndex: 101,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'black',
            width: 'max-content',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};
