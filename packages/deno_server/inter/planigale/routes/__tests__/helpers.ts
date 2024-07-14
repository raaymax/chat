
export async function login(fetch: (request: Request) => Promise<Response>){
  const request = new Request("http://localhost:8000/auth/session", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      login: "admin",
      password: "pass123",
    }),
  });
  const res = await fetch(request);
  return await res.json();
}
