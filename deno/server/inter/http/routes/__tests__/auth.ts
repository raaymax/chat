import { Agent } from "@planigale/testing";
import { ensureUser } from "./users.ts";
import { Repository } from "../../../../infra/mod.ts";

export async function login(repo: Repository, agent: Agent, login = "admin") {
  //console.log(await repo.user.removeMany({}));
  await ensureUser(repo, login);
  const res = await agent.request()
    .post("/api/auth/session")
    .json({
      login,
      password: "123",
    })
    .expect(200);
  const body = await res.json();
  return body;
}
