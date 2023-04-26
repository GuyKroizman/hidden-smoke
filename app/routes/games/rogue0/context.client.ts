import type PlayerCharacter from "~/routes/games/rogue0/player.client";

export type GameContext = {
  map: Phaser.Tilemaps.Tilemap | undefined;
  scene: Phaser.Scene | undefined;
  player?: PlayerCharacter;
};

export const context: GameContext = { scene: undefined, map: undefined };
