import { Webhook } from "../types.ts";
import type { Core } from "./core.ts";
import { Config } from "@quack/config";

export class Webhooks {
  constructor(private core: Core, private config: Config) {
    this.core.bus.onNotif(this.handleEvent.bind(this));
  }

  async handleEvent(event: any) {
    for (const webhook of (this.config?.webhooks ?? [])) {
      if (!webhook.events || webhook.events.includes(event.type)) {
        await this.send(webhook, event);
      }
    }
  }

  async send(webhook: Webhook, event: any) {
    try {
      const body = JSON.stringify({ type: event.type, event });
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      res.body?.cancel();
      if (!res.ok) {
        console.error(
          `Failed to send webhook ${webhook.url}: ${res.statusText}`,
        );
      }
    } catch (e) {
      console.error(`Failed to send webhook ${webhook.url}: ${e}`);
    }
  }
}
