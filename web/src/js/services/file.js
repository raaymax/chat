import client from '../client';
import { createCounter } from '../utils';
import { add, update } from '../store/file';

const tempId = createCounter(`file:${(Math.random() + 1).toString(36)}`);

export const upload = async (file) => {
  const local = {
    clientId: tempId(),
    fileName: file.name,
    contentType: file.type,
  };

  add(local);

  const ret = await client.req({
    op: {
      type: 'initUpload',
      fileName: file.name,
      contentType: file.type,
    },
  });

  update(local.clientId, {id: ret.resp.data.fileId});

  await fetch(ret.resp.data.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  await client.req({
    op: {
      type: 'finalizeUpload',
      fileId: ret.resp.data.fileId,
      fileName: file.name,
      contentType: file.type,
    },
  });
}
