export type GameContext = {
  map: Phaser.Tilemaps.Tilemap | undefined;
  scene: Phaser.Scene | undefined;
};

export const context: GameContext = { scene: undefined, map: undefined };
