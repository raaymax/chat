export class EntityId {
  constructor(public value: string ) {}

  static from(id: string | EntityId) {
    if (id instanceof EntityId) {
      return new EntityId(id.toString());
    } else if (typeof id === 'string') {
      return new EntityId(id);
    } else {
      console.log(id);
      throw new Error('Invalid id type');
    }
  }

  toString() {
    return this.value;
  }
}
  

export type Session = {
  id: EntityId,
  expires: Date,
  userId: EntityId,
  token: string,
  lastIp: string,
  lastUserAgent: string,
};

export type User = {
  id: EntityId,
  login: string,
  password: string,
  name: string,
};

export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT = 'DIRECT',
}

export type Channel = {
  id: EntityId,
  channelType: ChannelType,
  name: string,
  cid: string,
  private: boolean,
  direct: boolean,
  users: EntityId[],
}
