import Phaser from "phaser";
import { Scene0 } from "~/routes/games/rogue0/scene0.client";

export const rogue0Config = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 80 * 16,
  height: 50 * 16,
  backgroundColor: "#000000",
  pixelArt: true,
  scene: Scene0,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    }
  }
};
