import client from '../client';

export const upload = async (file) => {
  const ret = await client.req({
    op: {
      type: 'initUpload',
      fileName: file.name,
      contentType: file.type,
    },
  });

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
