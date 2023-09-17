import { Entity, EntityType } from "~/routes/games/rogue0/entity";
import { GameContext } from "~/routes/games/rogue0/context.client";

export default class Gem implements Entity {
  x?: number;
  y?: number;
  name: string = "Gem";
  description: string = "A gem";
  healthPoints: number = 0;
  tweens: number = 0;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite | undefined;
  type: EntityType = "item";
  tile = 992;

  constructor(context: GameContext, x?: number, y?: number) {
    this.x = x;
    this.y = y;

    if (this.x && this.y) {
      let x = context.map!.tileToWorldX(this.x);
      let y = context.map!.tileToWorldY(this.y);
      this.sprite = context.scene!.add.sprite(x || 0, y || 0, "tiles", this.tile);
      this.sprite.setOrigin(0);
    } else {
      this.sprite = undefined;
    }
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

  onDestroy() {
  }

}
