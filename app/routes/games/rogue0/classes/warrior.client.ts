import BasicHero from "./basicHero.client";
import type { GameContext } from "../context.client";
import Sword from "../items/sword";
import dungeon from "../dungeon.client";

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
