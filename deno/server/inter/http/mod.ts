import { Planigale } from "@planigale/planigale";
import { SchemaValidator } from "@planigale/schema";
import { bodyParser } from "@planigale/body-parser";
import { authMiddleware } from "./middleware/auth.ts";
import core from "../../core/mod.ts";

import { auth } from "./routes/auth/mod.ts";
import { system } from "./routes/system/mod.ts";
import { channels } from "./routes/channel/mod.ts";
import { files } from "./routes/files/mod.ts";
import { messages } from "./routes/messages/mod.ts";

const app = new Planigale();
try {
  const schema = new SchemaValidator();
  schema.addSchema({
    $id: "message",
    type: "object",
    required: ["text"],
    properties: {
      text: { type: "string" },
    },
  });

  app.use(bodyParser);
  app.use(authMiddleware(core));
  app.use(schema.middleware);

  app.use("/api", await system(core));
  app.use("/api/auth", await auth(core));
  app.use("/api/channels", await channels(core));
  app.use("/api/files", await files(core));

  app.onClose(() => core.close());
} catch (e) {
  console.error(e);
}
export default app;
