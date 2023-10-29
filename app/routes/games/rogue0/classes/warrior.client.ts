import BasicHero from "./basicHero.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import Sword from "~/routes/games/rogue0/items/sword";
import dungeon from "~/routes/games/rogue0/dungeon.client";

export default class Warrior extends BasicHero {

  constructor(context : GameContext, x: number, y: number) {
    super(context, x, y)

    this.name = "Warrior"
    this.movementPoints = 3
    this.actionPoints = 2

    this.items.push(new Sword(context))
    this.toggleItem(context, 0)

    dungeon.initializeEntity(context, this)
  }

  refresh() {
    this.movementPoints = 3
    this.actionPoints = 2
  }
}
