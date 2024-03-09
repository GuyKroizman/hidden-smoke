import type { GameContext } from "../context.client";
import Axe from "../items/axe.client";
import Shield from "../items/shield.client";
import BasicHero from "./basicHero.client";

export default class Dwarf extends BasicHero {
  constructor(context: GameContext, x: number, y: number) {
    super(context);

    this.name = "Dwarf";
    this.movementPoints = 2;
    this.actionPoints = 2;
    this.healthPoints = 35;
    this.tile = 9 * 49 + 29;

    this.items.push(new Axe(context));
    this.toggleItem(context, 0);

    this.items.push(new Shield(context));
    this.toggleItem(context, 1);

    this.init(context, x, y);
  }

  refresh() {
    this.movementPoints = 2;
    this.actionPoints = 2;
  }
}
