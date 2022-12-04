import Phaser from "phaser";
import dungeon from "~/routes/games/rogue0/dungeon.client";

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

    dungeon.initialize(this);
  }
}
