import level from "./level.client.js";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import type { Entity } from "~/routes/games/rogue0/turnManager.client";

export const Sprites = {
  floor: 0,
  wall: 49 * 13,
}

const tileSize = 16;

let dungeon = {
  initialize: function (context: GameContext) {
    const level0 = level.map((r) =>
      r.map((t) => (t == 1 ? Sprites.wall : Sprites.floor))
    );

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

  isWalkableTile: function (x: number, y: number) {
    return level[y][x] !== 1
  },

  moveEntityTo: function(context: GameContext, entity: Entity, x: number, y: number) {
    if (context.map == undefined || context.scene == undefined) {
      throw new Error("context.map is undefined");
    }
    entity.moving = true

    context.scene.tweens.add({
      targets: entity.sprite,
      onComplete: () => {
        entity.moving = false
        entity.x = x
        entity.y = y
      },
      x: context.map.tileToWorldX(x),
      y: context.map.tileToWorldY(y),
      ease: "Power2",
      duration: 200
    })
  }
};

export default dungeon;
