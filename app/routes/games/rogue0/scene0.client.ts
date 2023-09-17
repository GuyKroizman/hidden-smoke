import Phaser from "phaser";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import PlayerCharacter from "~/routes/games/rogue0/player.client";
import turnManager from "~/routes/games/rogue0/turnManager.client";
import Skeleton from "~/routes/games/rogue0/monsters/skelaton.client";
import LongSword from "~/routes/games/rogue0/items/longSword";

export class Scene0 extends Phaser.Scene {
  context: GameContext;
  private key: string;
  private active: boolean;

  constructor(context: GameContext) {
    super("scene0");

    this.context = context;
    this.key = "scene0";
    this.active = true;
  }

  preload() {
    this.load.spritesheet("tiles", "/colored.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
    });
  }

  create() {
    console.log('create scene')
    this.context.scene = this;

    dungeon.initialize(this.context);

    let player = new PlayerCharacter(this.context, 15, 15);
    this.context.entities.push(player)
    this.context.player = player;

    this.context.entities.push(new Skeleton(this.context,76, 10));
    this.context.entities.push(new Skeleton(this.context,20, 20));
    this.context.entities.push(new Skeleton(this.context,20, 10));
    this.context.entities.push(new Skeleton(this.context,29, 24));
    this.context.entities.push(new Skeleton(this.context,29, 20));

    this.context.entities.push(new LongSword(this.context, 18, 22))

    this.events.emit('entities-created');

    // Set camera, causes game viewport to shrink on the right side freeing
    // space for the UI scene.
    let camera = this.cameras.main
    camera.setViewport(0, 0, camera.worldView.width-200, camera.worldView.height)
    camera.setBounds(0, 0, camera.worldView.width, camera.worldView.height)
    camera.startFollow(this.context.player.sprite)
  }

  update() {
    if (turnManager.over(this.context)) {
      turnManager.refresh(this.context);
    }
    turnManager.turn(this.context);
  }
}
