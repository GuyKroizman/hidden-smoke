import type { GameContext } from "../context.client";
import { context } from "../context.client";
import { Entity, removeEntity } from "../entity";
import dungeon from "~/routes/games/rogue0/dungeon.client";

export default class HealthPotion extends Entity {
  constructor(context: GameContext, x?: number, y?: number) {
    super();
    this.tile = 761;
    this.name = "Health Potion";
    this.description = "A potion that removes cursed items when equipped."
    this.weapon = false;

    this.init(context, x, y);
  }

  equip(itemNumber: number) {
    if (!this.context.player) {
      return;
    }
    const points = Phaser.Math.Between(3, 5)

    dungeon.log(context, `A warm feeling is felt when drinking the potion as it restores ${points} health points.`)

    this.context.player.healthPoints  += points;
    removeEntity(this.context, this);
  }

  damage() {
    return 0;
  }

  turn() {
  }

  refresh() {
  }

  isOver() {
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
