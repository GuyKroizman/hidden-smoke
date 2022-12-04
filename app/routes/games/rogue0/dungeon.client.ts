import level from "./level.client.js";
import type { GameContext } from "~/routes/games/rogue0/context.client";

export const Sprites = {
  floor: 0,
  wall: 49 * 13,
}

let dungeon = {
  initialize: function (context: GameContext) {
    const level0 = level.map((r) =>
      r.map((t) => (t == 1 ? Sprites.wall : Sprites.floor))
    );

    const tileSize = 16;
    const config = {
      data: level0,
      tileWidth: tileSize,
      tileHeight: tileSize,
    };
    context.map = context.scene!.make.tilemap(config);
    const tileset = context.map.addTilesetImage(
      "tiles",
      "tiles",
      tileSize,
      tileSize,
      0,
      1
    ); // key: texture key
    context.map.createLayer(0, tileset, 0, 0);
  },
};

export default dungeon;
