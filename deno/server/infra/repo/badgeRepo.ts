import { Badge } from "../../types.ts";
import { Repo } from "./repo.ts";

type BadgeQuery = Partial<Badge>;
class BadgeRepo extends Repo<BadgeQuery, Badge> {
  COLLECTION = "badges";

  increment(where: BadgeQuery): void {
    this.updateMany(where, { count: 1 }, "inc");
  }

  reset(where: BadgeQuery): void {
    this.updateMany(where, { count: 0 }, "set");
  }
}

export const badge = new BadgeRepo();
