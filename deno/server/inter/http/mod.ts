import { Planigale } from '@planigale/planigale';
import { SchemaValidator } from '@planigale/schema';
import { bodyParser } from '@planigale/body-parser';
import * as routes from "./routes.ts";
import { authMiddleware } from "./middleware/auth.ts";
import core from "../../core/mod.ts";
const app = new Planigale();
try{ 
  const schema = new SchemaValidator();
/*
  schemaValidator.addSchema('message', {
    type: 'object',
    required: ['text'],
    properties: {
      text: { type: 'string' },
    },
  });
  */  

  app.use(bodyParser);
  app.use(authMiddleware(core))
  app.use(schema.middleware);


  for (const route of Object.values(routes)) {
    app.use(await route(core));
  }

  app.onClose(() => core.close());

}catch(e){
  console.error(e);
}
export default app;
