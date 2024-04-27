import BasicHero from "./basicHero.client";
import type { GameContext } from "../context.client";
import Bow from "../items/bow.client";

export default class Elf extends BasicHero {
  constructor(context : GameContext, x: number, y: number) {
    super(context);

    this.name = "Elf";
    this.movementPoints = 4;
    this.actionPoints = 3;
    this.healthPoints = 20;
    this.tile = 49 + 28;

    this.items.push(new Bow(context));
    this.toggleItem(context,0)

    this.init(context, x, y);
  }

  refresh() {
    this.movementPoints = 4;
    this.actionPoints = 3;
  }
}
