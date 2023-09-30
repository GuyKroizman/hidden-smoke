import { Entity } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import type { EntityType } from "~/routes/games/rogue0/entity";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import { removeEntity } from "~/routes/games/rogue0/entity";

export default class HolyPotion extends Entity {
  name: string = "Holy Potion";
  description: string = "A potion that removes cursed items when equipped.";
  moving: boolean = false;
  type: EntityType = "item";
  tile = 13 * 49 + 33;

  constructor(context: GameContext, x?: number, y?: number) {
    super();
    this.init(context, x, y);
  }

  equip(itemNumber: number) {
    if (!this.context.player) {
      return;
    }
    dungeon.log(this.context, `A blessing passes through your body and removes all cursed items.`);
    this.context.player.removeItemByProperty("cursed", true);
    this.context.player.removeItem(itemNumber);
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
