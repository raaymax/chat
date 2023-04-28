import Repo from '../repo';
import { Badge, BadgeQuery, MongoBadge } from './badgeTypes';
import { BadgeSerializer } from './badgeSerializer';

export class BadgeRepo extends Repo<BadgeQuery, Badge, MongoBadge> {
  constructor() {
    super('badges', new BadgeSerializer());
  }
  increment(where: BadgeQuery): void {
    this.updateMany(where, { count: 1 }, 'inc');
  }
  reset(where: BadgeQuery): void {
    this.updateMany(where, { count: 0 }, 'set');
  }
}
