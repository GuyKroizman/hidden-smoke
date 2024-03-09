import BasicHero from "./basicHero.client";
import type { GameContext } from "../context.client";
import Hammer from "../items/hammer.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";

export default class Cleric extends BasicHero {

  constructor(context : GameContext, x: number, y: number) {
    super(context, x, y)

    this.name = "Cleric"
    this.movementPoints = 3
    this.actionPoints = 2
    this.healthPoints = 40
    this.tile = 2 * 49 + 24;

    this.items.push(new Hammer(context))
    this.toggleItem(context, 0)
  }

  refresh() {
    this.movementPoints = 3
    this.actionPoints = 2

    // Cleric heals a bit every turn
    if (this.healthPoints < 40) {
      this.healthPoints += 1
      dungeon.log(this.context, "Cleric heals 1 HP")
    }
  }
}
