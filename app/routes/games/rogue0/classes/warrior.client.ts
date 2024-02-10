import BasicHero from "./basicHero.client";
import type { GameContext } from "../context.client";
import Sword from "../items/sword";

export default class Warrior extends BasicHero {

  constructor(context : GameContext, x: number, y: number) {
    super(context, x, y)

    this.name = "Warrior"
    this.movementPoints = 3
    this.actionPoints = 2

    this.items.push(new Sword(context))
    this.toggleItem(context, 0)
  }

  refresh() {
    this.movementPoints = 3
    this.actionPoints = 2
  }
}
