import {EntityId} from "../types.ts";
type Listeners = { [key: string]: Function[] };

class Emitter {
  listeners: Listeners = {};

  on = (ev: string, cb: (...args: any[]) => void) => {
    this.listeners[ev] = this.listeners[ev] ?? [];
    this.listeners[ev].push(cb);
    return () => {
      this.listeners[ev].splice(this.listeners[ev].indexOf(cb), 1);
    }
  };

  emit = (ev: string, ...args: any[]) => {
    (this.listeners[ev] ?? []).forEach((cb) => cb(...args));
  }

  eventNames = () => Object.keys(this.listeners);
  listenerCount = (ev: string) => this.listeners[ev]?.length ?? 0;
}


class Bus {
  bus = new Emitter();
  hasKey = (userId: EntityId | string) => this.bus.eventNames().includes(userId.toString());
  getListeners = () => this.bus.eventNames().reduce((acc, ev) => ({ ...acc, [ev]: this.bus.listenerCount(ev) }), {});
  group = (userIds: (EntityId | string)[], msg: any) => (userIds ?? []).forEach((userId) => this.bus.emit(userId.toString(), { ...msg, _target: 'group' }));
  direct = (userId: EntityId | string, msg: any) => this.bus.emit(userId.toString(), { ...msg, _target: 'direct' });
  broadcast = (msg: any) => this.bus.emit('all', { ...msg, _target: 'broadcast' });
  on = (userId: EntityId | string, cb: (...args: any[]) => void) => {
    const a = bus.on(userId.toString(), cb);
    const b = bus.on('all', cb);
    return () => {
      a();
      b();
    }
  };
}

export const bus = new Bus();
