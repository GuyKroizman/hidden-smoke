import type { Entity, EntityType } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";

export default class CursedGem implements Entity {
  x?: number;
  y?: number;
  name: string = "Cursed Gem";
  description: string = "A cursed gem that is now stuck to your hand. You can only remove it by finding a potion.";
  healthPoints: number = 0;
  tweens: number = 0;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite | undefined;
  type: EntityType = "item";
  tile = 4 * 49 + 23;
  actionPoints: number = 1;
  cursed: boolean = true;
  context: GameContext;
  active: boolean = false;

  constructor(context: GameContext, x?: number, y?: number) {
    this.x = x;
    this.y = y;
    this.context = context;

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
    if (this.context.player?.items.includes(this)) {
      this.active = true;
      dungeon.log(this.context, `Cursed gem gives 1 damage to player. Find potion to cure.`);
      this.context.player.healthPoints -= 1;
      this.actionPoints = 0;
    }

    this.actionPoints = 0;
  }

  refresh() {
    this.actionPoints = 1;
  }

  over() {
    return this.actionPoints === 0;
  }

  attack(): number {
    return 0;
  }

  onDestroy() {
  }
}
