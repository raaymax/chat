import { createCommand } from "../command.ts";
import { ResourceNotFound } from "../errors.ts";
import { commands } from "./repository.ts";
import { commandBodyValidator } from "./params.ts";

export default createCommand({
  type: "command:execute",
  body: commandBodyValidator,
}, async (msg, core) => {
  const command = commands.find((command) => command.commandName === msg.name);
  if (command) {
    return await command.execute(msg, core);
  }
  if (msg.name === "echo") {
    const response = {
      id: `sys:${Math.random().toString(10)}`,
      channelId: msg.context.channelId,
      flat: msg.text,
      message: { text: msg.text },
      createdAt: new Date().toISOString(),
    };

    core.bus.direct(msg.userId, {
      type: "message",
      ...response,
    });
    return;
  }

  if (msg.name === "help") {
    core.bus.direct(msg.userId, {
      type: "message",
      clientId: `sys:${Math.random().toString(10)}`,
      channelId: msg.context.channelId,
      flat: `Available commands: ${
        commands.map((command) => "/" + command.commandName).join(", ")
      }`,
      message: [
        { line: `Available commands:` },
        {
          bullet: [
            ...commands.map((command) => ({
              item: [
                {
                  code: "/" + command.commandName +
                    (command.prompt ? " " + command.prompt : ""),
                },
                { text: " - " },
                { text: command.description },
              ],
            })),
          ],
        },
        { button: {text: 'Button', action: 'test', payload: {data: 'funny', why:'test'}} }
      ],
      createdAt: new Date().toISOString(),
    });
    return;
  }

  throw new ResourceNotFound("command not found");
});
