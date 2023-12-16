import { Entity } from "../entity";
import type { GameContext } from "../context.client";

export default class Sword extends Entity {
  constructor(context: GameContext, x?: number, y?: number) {
    super();
    this.tile = 776;
    this.name = "A Shield";
    this.description = "A basic shield. Gives +1 protection.";

    this.init(context, x, y);
  }

  equip(itemNumber: number) {
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
    return 1;
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
