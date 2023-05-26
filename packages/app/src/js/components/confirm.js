import { h } from 'preact';
import { useState } from 'preact/hooks';

export const Delete = ({ accept }) => {
  const [show, setShow] = useState(false);

  return (
    <span class={`confirm ${show ? 'active' : ''}`} >
      {show && <i class={`fa-solid fa-circle-check ${show ? 'danger' : ''}`} onclick={accept} />}
      <i class={`fa-solid ${show ? 'fa-circle-xmark' : 'fa-trash-can'}`} onclick={() => setShow(!show)} />
    </span>
  );
};
