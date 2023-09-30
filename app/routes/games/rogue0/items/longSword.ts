import type { EntityType } from "~/routes/games/rogue0/entity";
import { Entity } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";

export default class LongSword extends Entity {
  name: string = "A Long Sword";
  description = "A long sword that causes between 1 and 8 damage.";
  weapon = true;
  tile = 329;
  healthPoints: number = 0;
  moving: boolean = false;
  type: EntityType = "item";

  constructor(context: GameContext, x?: number, y?: number) {
    super();
    this.init(context, x, y);
  }

  equip(itemNumber: number) {

  }

  damage() {
    return Phaser.Math.Between(4, 8);
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
