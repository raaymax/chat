import { createEndpoint } from "../../utils.ts";
import * as v from 'valibot';

export default createEndpoint(() => ({
  method: "GET",
  url: "/sse",
  auth: true,
  schema: {
    response: {
      200: {
        contentType: "text/event-stream",
      },
    },
  },
  handler: async (_req, res) => {
    //res.setHeader("Content-Type", "text/event-stream");
    const target = await res.sendEvents();
    target.addEventListener("close", (evt) => {
      console.log("close", evt);
      // perform some cleanup activities
    });

    target.dispatchMessage({ hello: "world" });

    setTimeout(() => {
      target.dispatchMessage({ hello: "this is important" });
    }, 1000);
  }
}));
