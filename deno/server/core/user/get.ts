import * as v from "valibot";
import { createQuery } from "../query.ts";
import { Id } from "../types.ts";

export default createQuery({
  type: "user:get",
  body: v.object({
    id: Id,
  }),
}, async (query, { repo }) => {
  return await repo.user.get({ id: query.id });
});
