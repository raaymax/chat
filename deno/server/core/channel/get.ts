import * as v from "valibot";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";

export default createQuery({
  type: "channel:get",
  body: v.required(v.object({
    userId: Id,
    id: v.optional(Id),
  })),
}, async (query, { repo }) => await repo.channel.get(query));
