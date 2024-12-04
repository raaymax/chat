import * as v from "valibot";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";

export default createQuery({
  type: "channel:getAll",
  body: v.required(v.object({
    userId: Id,
  })),
}, async (query, { repo }) => await repo.channel.getAll(query));
