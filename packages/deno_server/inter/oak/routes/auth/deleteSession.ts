
import { createEndpoint } from "../../utils.ts";

export default createEndpoint(({core}) => ({
  method: "DELETE",
  url: "/auth/session",
  schema: {
    response: {
      200: {
        contentType: "application/json",
      },
    },
  },
  handler: async (req, res) => {
    if(req.session) {
      await core.dispatch({
        type: 'session:remove',
        body: {
          sessionId: req.session.id,
        }
      });
    }
    req.cookies.delete('token');
    return { status: 'ok' };
  }
}));
