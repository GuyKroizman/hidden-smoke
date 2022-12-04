import Phaser from "phaser";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import { context } from "~/routes/games/rogue0/context.client";
import PlayerCharacter from "~/routes/games/rogue0/player.client";
import turnManager from "~/routes/games/rogue0/turnManager.client";

export class Scene0 extends Phaser.Scene {
  constructor() {
    super("idk");
  }

  preload() {
    this.load.spritesheet("tiles", "/colored.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
    });
  }

  create() {
    context.scene = this;
    dungeon.initialize(context);
    let player = new PlayerCharacter(15, 15, context);
    turnManager.addEntity(player);
  }

  update() {
    if (!turnManager.over()) {
      turnManager.refresh();
    }
    turnManager.turn(context);
  }
}
