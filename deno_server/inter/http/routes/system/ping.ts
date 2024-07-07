import { createEndpoint } from "../../utils.ts";
import * as v from 'valibot';

export default createEndpoint(() => ({
  method: "GET",
  url: "/ping",
  schema: {
    response: {
      200: {
        contentType: "application/json",
      },
    },
  },
  handler: async (_req, res) => {
    res.send({ status: 'ok' });
  }
}));
