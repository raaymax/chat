import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "POST",
    url: "/execute",
    schema: {
      body: {
        type: 'object',
        required: ['name', 'text', 'context'],
        properties: {
          name: { type: 'string' },
          text: { type: 'string', description: 'Everything that comes after the command name `/command <text>`' },
          attachments: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'fileName'],
              properties: {
                id: { type: 'string' },
                fileName: { type: 'string' },
                contentType: { type: 'string' },
              },
            },
          },
          context: {
            type: 'object',
            required: ['channelId'],
            properties: {
              channelId: { type: 'string' },
              parentId: { type: 'string' },
              appVersion: { type: 'string' },
            },
          },
        },
      },
    },
    handler: async (req) => {
      const body = req.body;
      await core.dispatch({
        type: "command:execute",
        body: {
          userId: req.state.user.id,
          name: body.name.replace(/^\//, ''),
          text: body.text,
          attachments: body.attachments,
          context: body.context,
        }
      })
      return Res.empty();
    },
  });
