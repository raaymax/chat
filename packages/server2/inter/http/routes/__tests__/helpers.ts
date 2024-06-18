import { superoak } from "superoak";
import { Application } from '@oak/oak';

export async function login(app: Application) {
  const request = await superoak(app);
  const res = await request.post("/auth/session").send({
    login: "admin",
    password: "pass123",
  }).expect(200);
  return {token: res.body.token, userId: res.body.userId};
}
