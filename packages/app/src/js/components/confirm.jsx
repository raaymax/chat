import { useState } from 'react';
import PropTypes from 'prop-types';

export const Delete = ({ accept }) => {
  const [show, setShow] = useState(false);

  return (
    <span className={`confirm ${show ? 'active' : ''}`} >
      {show && <i className={`fa-solid fa-circle-check ${show ? 'danger' : ''}`} onClick={accept} />}
      <i className={`fa-solid ${show ? 'fa-circle-xmark' : 'fa-trash-can'}`} onClick={() => setShow(!show)} />
    </span>
  );
};

Delete.propTypes = {
  accept: PropTypes.func,
};
