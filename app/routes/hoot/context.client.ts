export type HootGameContext = {
  scene: Phaser.Scene | undefined;
  ropeSegments: Phaser.GameObjects.Shape[];
  balls: Phaser.GameObjects.Shape[];
};

export const hootContext: HootGameContext = {
  scene: undefined,
  ropeSegments: [],
  balls: []
}; 