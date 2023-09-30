import type { EntityType } from "~/routes/games/rogue0/entity";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import { Entity} from "~/routes/games/rogue0/entity";
import dungeon from "~/routes/games/rogue0/dungeon.client";


export default class Shoe extends Entity {
  name: string = "Shoe";
  description: string = "A shoe";
  moving: boolean = false;
  type: EntityType = "item";
  tile: number = 19 * 49 + 32;

  constructor(context: GameContext, x?: number, y?: number) {
    super();
    this.init(context, x, y);
  }

  equip(/*itemNumber: number*/) {
    if (!this.context.player) {
      return;
    }
    dungeon.log(this.context, 'You cannot use this shoe.');
  }

  damage(): number {
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
