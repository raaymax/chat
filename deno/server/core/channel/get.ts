import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import * as v from "valibot";

export default createQuery({
  type: "channel:get",
  body: v.required(v.object({
    userId: Id,
    id: v.optional(Id),
  })),
}, async (query, { repo }) => {
  return await repo.channel.get(query);
});
