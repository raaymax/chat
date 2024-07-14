import { Planigale, SchemaValidator } from '@codecat/planigale';
import * as routes from "./routes.ts";
import { authMiddleware } from "./middleware/auth.ts";
import core from "../../core/mod.ts";

const app = new Planigale();
const schemaValidator = new SchemaValidator();

app.use(authMiddleware(core))
app.use(schemaValidator.middleware);

for (const route of Object.values(routes)) {
  app.use(await route(core));
}

app.onClose(() => core.close());
export default app;
