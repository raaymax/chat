let nextId = 0;
Deno.serve({ port: 8888 }, async (request) => {
  const { pathname, search } = new URL(request.url);
  const url = new URL(pathname, 'https://storage.googleapis.com');
  const headers = new Headers(request.headers);

  console.log('proxy', request.method, url.href);
  const id = nextId++;

  console.time(`${id} ${url.href}`);
  const res = await fetch(url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'manual',
  });
  console.timeEnd(`${id} ${url.href}`);
  return res;
});
