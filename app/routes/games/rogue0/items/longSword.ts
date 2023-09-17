import { Entity, EntityType } from "~/routes/games/rogue0/entity";
import { GameContext } from "~/routes/games/rogue0/context.client";

export default class LongSword implements Entity{
  x?: number;
  y?: number;
  name: string = "A Long Sword";
  description = "A long sword that causes between 1 and 8 damage."
  weapon = true
  tile = 329
  healthPoints: number = 0;
  tweens: number = 0;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite | undefined;
  type:EntityType =  "item";

  constructor(context: GameContext, x?: number, y?: number ) {
    this.x = x;
    this.y = y;
  }

  damage() {
    return Phaser.Math.Between(4, 8)
  }

  turn() {
  }

  refresh() {
  }

  over() {
    return true
  }

  attack(): number {
    return 0
  }

  onDestroy() {
  }

}
