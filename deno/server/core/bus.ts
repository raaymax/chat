import { EntityId } from "../types.ts";
import { serialize } from "./serializer.ts";
type Listeners = { [key: string]: Function[] };

class Emitter {
  listeners: Listeners = {};

  on = (ev: string, cb: (...args: any[]) => void) => {
    this.listeners[ev] = this.listeners[ev] ?? [];
    this.listeners[ev].push(cb);
    return () => {
      this.listeners[ev].splice(this.listeners[ev].indexOf(cb), 1);
    };
  };

  emit = (ev: string, ...args: any[]) => {
    (this.listeners[ev] ?? []).forEach((cb) => cb(...serialize(args)));
  };

  eventNames = () => Object.keys(this.listeners);
  listenerCount = (ev: string) => this.listeners[ev]?.length ?? 0;
}

const internalBus = new Emitter();

export class Bus {
  hasKey = (userId: EntityId | string) =>
    internalBus.eventNames().includes(userId.toString());
  getListeners = () =>
    internalBus.eventNames().reduce(
      (acc, ev) => ({ ...acc, [ev]: internalBus.listenerCount(ev) }),
      {},
    );
  group = (userIds: (EntityId | string)[], msg: any) => {
    (userIds ?? []).forEach((userId) =>
      internalBus.emit(userId.toString(), { ...msg, _target: "group" })
    );
  }
  direct = (userId: EntityId | string, msg: any) =>
    internalBus.emit(userId.toString(), { ...msg, _target: "direct" });
  broadcast = (msg: any) =>
    internalBus.emit("all", { ...msg, _target: "broadcast" });
  on = (userId: EntityId | string, cb: (...args: any[]) => void) => {
    const a = internalBus.on(userId.toString(), cb);
    const b = internalBus.on("all", cb);
    return () => {
      a();
      b();
    };
  };
}

export const bus = new Bus();
