import { repo } from "../../infra/mod.ts";
import * as v from "valibot";
import { createQuery } from "../query.ts";
import { Id } from "../types.ts";

export default createQuery({
  type: "users:getAll",
  body: v.optional(v.any())
}, async () => {
  return await repo.user.getAll({});
});
