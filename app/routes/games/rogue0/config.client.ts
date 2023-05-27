import Phaser from "phaser";
import { Scene0 } from "~/routes/games/rogue0/scene0.client";
import { UI } from "~/routes/games/rogue0/ui.client";
import { context } from "~/routes/games/rogue0/context.client";

const scene0 = new Scene0(context);

let ui = new UI(context);
console.log('ui is active', ui.active)

export const rogue0Config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser",
  width: 80 * 16,
  height: 50 * 16,
  backgroundColor: "#472d3c",
  pixelArt: true,
  scene: [scene0, ui],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    }
  }
};
