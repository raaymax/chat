import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';

export const Tooltip = ({children, text}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{position: 'relative'}}
      onMouseEnter={()=>setShow(true)}
      onMouseLeave={()=>setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: 'absolute',
            zIndex: 101,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'black',
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
}

