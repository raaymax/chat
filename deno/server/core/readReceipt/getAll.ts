import * as v from "valibot";
import { createQuery } from "../query.ts";
import { Id } from "../types.ts";

export default createQuery({
  type: "readReceipt:getOwn",
  body: v.object({
    userId: Id,
  }),
}, async ({ userId }, { repo }) => await repo.badge.getAll({ userId }));
