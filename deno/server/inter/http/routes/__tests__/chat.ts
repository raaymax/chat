import { assert, assertEquals } from "@std/assert";
import { Agent } from "@planigale/testing";
import { Repository } from "../../../../infra/mod.ts";
import { ensureUser } from "./users.ts";
import { Channel, EntityId, Message, ReplaceEntityId } from "../../../../types.ts";
import { SSESource } from "@planigale/sse";


export class Chat {
  repo: Repository;
  agent: Agent;
  token: string; 
  parent: Chat | null;
  userId: string | null;
  channelId: string | null;
  parentId: string | null;
  eventSource: SSESource | null;
  ended = false;
  currentStep = 0;

  steps: any[] = [];
  cleanup: any[] = [];

  static init(repo: Repository, agent: Agent) {
    return new Chat(repo, agent);
  }
  
  constructor(repo: Repository, agent: Agent, parent: Chat | null = null) {
    this.repo = repo;
    this.agent = agent;
    this.parent = parent;
    this.userId = null;
    this.channelId = null;
    this.parentId = null; // parent and parentId are not related "parent" is a parent of this object
    this.token = "invalid";
    this.eventSource = null;
  }

  connectSSE() {
    this.steps.push(async () => {
      this.eventSource = this.agent.events("/api/sse", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const { event } = await this.eventSource.next();
      assertEquals(JSON.parse(event?.data ?? ""), { "status": "connected" });
      this.cleanup.push(async () => {
        await this.eventSource?.close();
      });
    });
    return this;
  }

  nextEvent(fn: (event: any) => any) {
    this.steps.push(async () => {
      const { event } = await this.eventSource?.next() || {};
      await fn(JSON.parse(event?.data || "{}"));
    });
    return this;
  }

  login(login = "admin") {
    this.steps.push(async () => {
      await ensureUser(this.repo, login);
      const res = await this.agent.request()
        .post("/api/auth/session")
        .json({
          login,
          password: "123",
        })
        .expect(200);
      const body = await res.json();
      this.userId = body.userId;
      this.token = body.token;
    });
    return this;
  }
  
  createChannel (
    channel: Partial<ReplaceEntityId<Channel>>,
  ) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .post("/api/channels")
        .json({
          ...channel
        })
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);

      const body = await res.json();
      const channelId = body.id;
      this.channelId = channelId;
      this.cleanup.push(async () => {
        await this.repo.message.removeMany({ channelId: EntityId.from(channelId) });
        await this.repo.channel.remove({ id: EntityId.from(channelId) });
      });
    });
    return this;
  }

  gotoChannel(channelName: string) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .get("/api/channels")
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      const channelId = body.find(({ name }: { name: string }) => name === channelName).id;
      assert(channelId);
      this.channelId = channelId;
    });
    return this;
  }

  removeChannel() {
    this.steps.push(async () => {
      await this.agent.request()
        .delete(`/api/channels/${this.channelId}`)
        .emptyBody()
        .header("Authorization", `Bearer ${this.token}`)
        .expect(204);
      const res = await this.agent.request()
        .get(`/api/channels/${this.channelId}`)
        .header("Authorization", `Bearer ${this.token}`)
        .expect(404);
      res.body?.cancel?.();
    });
    return this;
  }

  getChannel(fn: (channel: Channel) => Promise<any>) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .get(`/api/channels/${this.channelId}`)
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      await fn(body);
    });
    return this;
  }

  getEmojis(fn: (emojis: any[]) => Promise<any>) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .get("/api/emojis")
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      await fn(body);
    });
    return this;
  }

  getConfig(fn: (config: any) => Promise<any>) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .get("/api/profile/config")
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      await fn(body);
    });
    return this;
  }

  getChannels(fn: (channels: Channel[]) => Promise<any>) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .get("/api/channels")
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      await fn(body);
    });
    return this;
  }

  getUsers(fn: (users: any[]) => Promise<any>) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .get("/api/users")
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      await fn(body);
    });
    return this;
  }

  sendMessage(message: Partial<Message>, test?: (message: Message) => Promise<any>) {
    this.steps.push(async () => {
      const res = await this.agent.request()
        .post("/api/messages")
        .json({
          ...message,
          channelId: this.channelId,
        })
        .header("Authorization", `Bearer ${this.token}`)
        .expect(200);
      const body = await res.json();
      test?.(body);
      this.cleanup.push(async () => {
        await this.repo.message.remove({ id: EntityId.from(body.id) });
      });
    });
    return this;
  }

  executeCommand(command: string, attachments: any[], test: (...args:any) => any) {
    this.steps.push(async () => {
      const [name, ...args] = command.split(" ");
      const text = args.join(" ");
      const events = this.agent.events("/api/sse", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      try {
        const { event } = await events.next();
        assertEquals(JSON.parse(event?.data ?? ""), { "status": "connected" });
        const res = await this.agent.request()
          .post("/api/commands/execute")
          .json({
            name,
            text,
            attachments,
            context: {
              channelId: this.channelId,
              appVersion: "1.0.0",
            },
          })
          .header("Authorization", `Bearer ${this.token}`)
          .expect(204);
        res.body?.cancel?.();
        await test({events, channelId: this.channelId});
      } finally {
        await events.close();
      }
    })
    return this;
  }

  end() {
    this.ended = true;
    return this;
  }

  async then(resolve: (self?: any) => any, reject: (e: Error) => any) {
    let cleanupStart = false;
    try {
      while(this.steps[this.currentStep]) {
        await this.steps[this.currentStep]();
        this.currentStep++;
      }
      if (!this.ended) {
        return resolve()
      }
      cleanupStart = true;
      for (const cleanup of this.cleanup) {
        await cleanup();
      }
      resolve();
    } catch (e) {
      if (!cleanupStart) {
        for (const cleanup of this.cleanup) {
          try {
            await cleanup();
          } catch (e) {
            console.error(e);
          }
        }
      }
      reject(e);
    }
  }
}

