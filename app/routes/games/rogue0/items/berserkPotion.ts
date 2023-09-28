import type { Entity } from "~/routes/games/rogue0/entity";
import type { EntityType } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import { removeEntity } from "~/routes/games/rogue0/entity";

export default class BerserkPotion implements Entity {
  x?: number;
  y?: number;
  name: string = "Berserk Potion";
  description: string = "That feels Powerful!";
  healthPoints: number = 0;
  tweens: number = 0;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite | undefined;
  type: EntityType = "item";
  tile = 13 * 49 + 33;
  context: GameContext;
  remainingTurns: number = 10;
  itermNumber: number | undefined;

  constructor(context: GameContext, x?: number, y?: number) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.itermNumber = undefined;

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
    dungeon.log(this.context, `You drink the potion and feel as strong as a bear!`);

    this.itermNumber = itemNumber;
  }

  damage() {
    return 5;
  }

  turn() {
  }

  refresh() {
  }

  over() {
    if (!this.context.player || this.itermNumber == undefined) {
      return true;
    }

    if (this.remainingTurns <= 0) {
      this.context.player.removeItem(this.itermNumber);
      removeEntity(this.context, this);
    }
    this.remainingTurns--;

    return true;
  }

  attack(): number {
    return 0;
  }

  onDestroy() {
  }
}
