import * as v from "valibot";
import { Id } from "../types.ts";

export const commandBodyValidator = v.required(
  v.object({
    userId: Id,
    name: v.string(),
    text: v.string(),
    attachments: v.optional(
      v.array(v.object({
        id: v.string(),
        fileName: v.string(),
        contentType: v.optional(v.string(), "application/octet-stream"),
      })),
      [],
    ),
    context: v.object({
      channelId: Id,
    }),
  }),
  ["name", "text", "context"],
);

export type CommandBody = v.InferOutput<typeof commandBodyValidator>;
