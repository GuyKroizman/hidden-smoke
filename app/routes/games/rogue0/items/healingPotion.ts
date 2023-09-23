import type { Entity, EntityType } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";

export default class HealingPotion implements Entity {
  x?: number;
  y?: number;
  name: string = "Healing Potion";
  description: string = "That feels refreshing!";
  healthPoints: number = 0;
  tweens: number = 0;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite | undefined;
  type: EntityType = "item";
  tile = 18 * 49 + 33;
  context: GameContext;

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

  equip(itemNumber: number) {
    if (!this.context.player) {
      return;
    }
    dungeon.log(this.context, `You drink the potion and feel refreshed.`);
    this.context.player.removeItem(itemNumber);
    this.context.player.healthPoints  = this.context.player.maxHealthPoints;
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

  onDestroy() {
  }
}
