import Phaser from "phaser";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import PlayerCharacter from "~/routes/games/rogue0/player.client";
import turnManager from "~/routes/games/rogue0/turnManager.client";
import Skeleton from "~/routes/games/rogue0/monsters/skelaton.client";

export class Scene0 extends Phaser.Scene {
  context: GameContext;

  constructor(context: GameContext) {
    super("idk");

    this.context = context;
  }

  preload() {
    this.load.spritesheet("tiles", "/colored.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
    });
  }

  create() {
    this.context.scene = this;

    dungeon.initialize(this.context);

    let player = new PlayerCharacter(15, 15, this.context);
    turnManager.addEntity(player);
    this.context.player = player;

    turnManager.addEntity(new Skeleton(this.context,70, 8));
  }

  update() {
    if (turnManager.over()) {
      turnManager.refresh();
    }
    turnManager.turn(this.context);
  }
}
