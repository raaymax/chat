import { Agent } from "@planigale/testing";
import { hash, verify } from "@ts-rex/bcrypt";
import { repo } from "../../../../infra/mod.ts";

export async function login(agent: Agent, login = "admin") {
  await ensureUser(login);
  const res = await agent.request()
    .post("/api/auth/session")
    .json({
      login,
      password: "123",
    })
    .expect(200);
  return await res.json();
}

export const ensureUser = async (login: string, data: {} = {}) => {
  const user = await repo.user.get({ login });
  if (!user) {
    await repo.user.create({
      login,
      password: hash("123"),
      ...data,
    });
  } else {
    await repo.user.update({id: user.id}, data);
  }
};
