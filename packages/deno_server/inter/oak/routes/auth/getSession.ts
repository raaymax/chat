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
      return req.session;
    } else {
      return { status: 'no-session' };
    }
  }
}));
