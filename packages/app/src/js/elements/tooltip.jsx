import { useState } from 'react';

export const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className='tooltip-container'
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
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};
