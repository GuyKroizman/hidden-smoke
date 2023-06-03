import Phaser from "phaser";
import { Scene0 } from "~/routes/games/rogue0/scene0.client";
import { context } from "~/routes/games/rogue0/context.client";

export const rogue0Config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 80 * 16,
  height: 50 * 16,
  backgroundColor: "#472d3c",
  pixelArt: true,
  scene: [new Scene0(context)],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    }
  }
};
