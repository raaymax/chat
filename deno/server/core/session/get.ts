import * as v from "valibot";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";

export default createQuery({
  type: "session:get",
  body: v.object({
    id: v.optional(Id),
    token: v.optional(v.string()),
  }),
}, async (query, { repo }) => await repo.session.get(query));
