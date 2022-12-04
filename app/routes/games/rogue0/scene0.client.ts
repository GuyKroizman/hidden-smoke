import Phaser from "phaser";

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
    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });

    this.add.image(60, 70, "tiles",180 );
  }
}
