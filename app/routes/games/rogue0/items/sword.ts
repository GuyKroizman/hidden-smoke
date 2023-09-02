import type { GameContext } from "../context.client";
import type { Entity } from "../entity"
import type { EntityType } from "../entity";

export default class Sword implements Entity{

  x?: number;
  y?: number;
  name: string = "A Sword";
  description: string = "A basic sword. Causes between 1 and 5 damage.";
  type:EntityType =  "item";
  healthPoints: number = 0;
  actionPoints: number = 0;
  tweens: number = 0;
  tile: number = 994;
  weapon: boolean = true;
  sprite: Phaser.GameObjects.Sprite | undefined;
  moving: boolean = false;


  constructor(context: GameContext, x?: number, y?: number ) {
    this.x = x;
    this.y = y;

    if (this.x && this.y) {
      let x = context.map!.tileToWorldX(this.x)
      let y = context.map!.tileToWorldY(this.y)
      this.sprite = context.scene!.add.sprite(x || 0, y || 0, "tiles", this.tile)
      this.sprite.setOrigin(0)
    } else {
      this.sprite = undefined;
    }
  }

  damage() {
    return Phaser.Math.Between(1, 5)
  }

  turn() {
  }

  equip() {
  }

  unequip() {
  }

  refresh() {
  }

  over() {
    return true
  }

  createUI() {
    return 0
  }

  attack(): number {
    return 0
  }

  onDestroy() {
  }
}
