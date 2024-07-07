import { createEndpoint } from "../../utils.ts";

export default createEndpoint(({core}) => ({
  method: "GET",
  url: "/channels",
  auth: true,
  schema: {
    response: {
      200: {
        contentType: "application/json",
      },
    },
  },
  handler: async (req) => {
    const channels = await core.channel.getAll({ userId: req.userId });
    return channels;
  }
}));
