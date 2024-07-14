import { Planigale, Router } from '@codecat/planigale';
import * as routes from "./routes.ts";
import { authMiddleware } from "./middleware/auth.ts";
import core from "../../core/mod.ts";

const app = new Planigale();

app.use(authMiddleware(core))

const router = new Router();

Object.values(routes).forEach((route) => {
  route({core})(router);
});

app.use('', router);

app.addEventListener('close', async () => {
  await core.close();
});

export default app;
