import { Planigale, Router, Res } from "@planigale/planigale";
import { SchemaValidator } from "@planigale/schema";
import { bodyParser } from "@planigale/body-parser";
import { authMiddleware } from "./middleware/auth.ts";
import { Core } from "../../core/mod.ts";
import {messageSchema} from "./schema/message.ts";
import { allowCors } from "./cors.ts";
import { errorHandler } from "./errors.ts";
import * as path from "@std/path";

import { auth } from "./routes/auth/mod.ts";
import { system } from "./routes/system/mod.ts";
import { channels } from "./routes/channel/mod.ts";
import { files } from "./routes/files/mod.ts";
import { profile } from "./routes/profile/mod.ts";
import { users } from "./routes/users/mod.ts";
import { messages } from "./routes/messages/mod.ts";

const PUBLIC_DIR = Deno.env.get("PUBLIC_DIR") || path.join(Deno.cwd(), '..','..', "packages", "app", "dist");

export class HttpInterface extends Planigale {
  constructor(private core: Core) {
    super();
    try {
      const schema = new SchemaValidator();
      schema.addFormat("entity-id", /^[a-fA-F0-9]{24}$/)
      schema.addSchema(messageSchema);

      //allowCors(this);
      this.use(errorHandler);
      this.use(bodyParser);
      this.use(authMiddleware(core));
      this.use(schema.middleware);
      this.use("/api", system(core));
      this.use("/api/auth", auth(core));
      this.use("/api/channels", channels(core));
      this.use("/api/profile", profile(core));
      this.use("/api/users", users(core));
      this.use("/api", messages(core));
      files(core).then((router: Router) => this.use("/api/files", router));
      this.route({
        method: 'GET',
        url: "/:path*",
        public: true,
        handler: async (req) => {
          if (PUBLIC_DIR.startsWith("http")) {
            return await fetch(`${PUBLIC_DIR}/${req.params.path}`, {method: 'GET'});
          }
          console.log(path.join(PUBLIC_DIR, req.params.path))
          return Res.file(path.join(PUBLIC_DIR, req.params.path));
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
