import type PlayerCharacter from "~/routes/games/rogue0/player.client";

import { Entity } from "~/routes/games/rogue0/entity";

export type GameContext = {
  map: Phaser.Tilemaps.Tilemap | undefined;
  scene: Phaser.Scene | undefined;
  player?: PlayerCharacter;
  entities: Entity[];
};

export const context: GameContext = { scene: undefined, map: undefined, entities: [] };
