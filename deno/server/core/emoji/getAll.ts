import * as v from "valibot";
import { createQuery } from "../query.ts";
import { Id } from "../types.ts";

export default createQuery({
  type: "emoji:getAll",
  body: v.optional(v.any())
}, async (_body, {repo}) => {
  return await repo.emoji.getAll({});
});
