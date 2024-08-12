import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import * as v from "valibot";

export default createQuery({
  type: "channel:getAll",
  body: v.required(v.object({
    userId: Id,
  })),
}, async (query, {repo}) => {
  return await repo.channel.getAll(query);
});
