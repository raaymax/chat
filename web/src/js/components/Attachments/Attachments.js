import {h} from 'preact';
import { useEffect, useRef, useState } from '../../utils.js';
import * as files from '../../store/file';
import {FilePlaceholder} from './filePlaceholder';

export const Attachments = () => {
  const [list, setList] = useState([]);
  files.watchFiles((l) => setList([...l]));

  return (
    <div class='attachments'>
      {list.map((file) => (
        <FilePlaceholder
          key={file.clientId}
          data={{...file}}
          ondelete={() => {
            file.abort();
            files.remove(file.clientId);
          }}
        />
      ))}
    </div>
  );
}
