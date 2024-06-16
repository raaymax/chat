import { createEndpoint } from "../../utils.ts";

export default createEndpoint(() => ({
  method: "GET",
  url: "/auth/session",
  schema: {
    response: {
      200: {
        contentType: "application/json",
      },
    },
  },
  handler: async (req, res) => {
    if (req.session) {
      res.send(req.session);
    } else {
      res.send({ status: 'no-session' });
    }
  }
}));
