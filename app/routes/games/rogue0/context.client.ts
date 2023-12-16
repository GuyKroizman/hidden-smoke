import type { Entity } from "~/routes/games/rogue0/entity";
import type BasicHero from "~/routes/games/rogue0/classes/basicHero.client";

export type GameContext = {
  map: Phaser.Tilemaps.Tilemap | undefined;
  scene: Phaser.Scene | undefined;
  player?: BasicHero;
  entities: Entity[];
  messages: string[];
};

export const context: GameContext = { scene: undefined, map: undefined, entities: [], messages: [] };
