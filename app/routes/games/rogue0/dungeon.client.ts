import level from "./level.client.js";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import PF from "pathfinding";
import type { Entity } from "~/routes/games/rogue0/entity";
import { removeEntity } from "~/routes/games/rogue0/entity";

export const Sprites = {
  floor: 0,
  wall: 49 * 13,
};

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
    );

    if(!tileset) {
      console.error("Failed to load tileset named tiles")
      return
    }

    context.map.createLayer(0, tileset, 0, 0);
  },

  isWalkableTile: function (context: GameContext, x: number, y: number) {
    for (const entity of context.entities) {
      if (entity.x === x && entity.y === y) return false;
    }

    const tileAtDestination = context.map?.getTileAt(x, y);
    return tileAtDestination?.index !== Sprites.wall;
  },

  entityAtTile: function (context: GameContext, x: number, y: number) {
    for (const entity of context.entities) {
      if (entity.x === x && entity.y === y) return entity;
    }
    return undefined;
  },

  distanceBetweenEntities: function (entity1: Entity, entity2: Entity) {
    const grid = new PF.Grid(level);
    const finder = new PF.AStarFinder({
      diagonalMovement: PF.DiagonalMovement.Always,
    });
    const path = finder.findPath(
      entity1.x,
      entity1.y,
      entity2.x,
      entity2.y,
      grid
    );
    return path.length >= 2 ? path.length : 0;
  },

  moveEntityTo: function (
    context: GameContext,
    entity: Entity,
    x: number,
    y: number
  ) {
    if (context.map == undefined || context.scene == undefined) {
      throw new Error("context.map is undefined");
    }
    entity.moving = true;

    context.scene.tweens.add({
      targets: entity.sprite,
      onComplete: () => {
        entity.moving = false;
        entity.x = x;
        entity.y = y;
      },
      x: context.map.tileToWorldX(x),
      y: context.map.tileToWorldY(y),
      ease: "Power2",
      duration: 200,
    });
  },
  attackEntity: function (
    context: GameContext,
    attacker: Entity,
    victim: Entity
  ) {
    if (!context.scene || !context.map) {
      throw new Error("context scene or map are missing");
    }
    attacker.moving = true;
    attacker.tweens = attacker.tweens || 0;
    attacker.tweens += 1;

    context.scene.tweens.add({
      targets: attacker.sprite,
      onComplete: () => {
        attacker.sprite.x = context.map?.tileToWorldX(attacker.x)!;
        attacker.sprite.y = context.map?.tileToWorldX(attacker.y)!;
        attacker.moving = false;
        attacker.tweens -= 1;

        let damage = attacker.attack();
        victim.healthPoints -= damage;

        this.log(context, `${attacker.name} does ${damage} damage to ${victim.name}.`)

        if (victim.healthPoints <= 0) {
          removeEntity(context, victim);
        }
      },
      x: context.map.tileToWorldX(victim.x),
      y: context.map.tileToWorldY(victim.y),
      ease: "Power2",
      hold: 20,
      duration: 80,
      delay: attacker.tweens * 200,
      yoyo: true,
    });
  },
  log: function(context: GameContext, text: string) {
    context.messages.unshift(text)
    context.messages = context.messages.slice(0,8)
  }
};

export default dungeon;
