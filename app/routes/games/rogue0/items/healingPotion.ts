import type { EntityType } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import { removeEntity , Entity} from "~/routes/games/rogue0/entity";

export default class HealingPotion extends Entity {
  name: string = "Healing Potion";
  description: string = "That feels refreshing!";
  moving: boolean = false;
  type: EntityType = "item";
  tile = 18 * 49 + 33;

  constructor(context: GameContext, x?: number, y?: number) {
    super();
    this.init(context, x, y);
  }

  equip(itemNumber: number) {
    if (!this.context.player) {
      return;
    }
    dungeon.log(this.context, `You drink the potion and feel refreshed.`);
    this.context.player.removeItem(itemNumber);
    this.context.player.healthPoints  = this.context.player.maxHealthPoints;
    removeEntity(this.context, this);
  }

  damage() {
    return 0;
  }

  turn() {
  }

  refresh() {
  }

  over() {
    return true;
  }

  attack(): number {
    return 0;
  }

  protection(): number {
    return 0;
  }

  range(): number {
    return 0;
  }

  onDestroy() {
  }
}
