export type HootGameContext = {
  scene: Phaser.Scene | undefined;
  balls: Phaser.GameObjects.Shape[];
};

export const hootContext: HootGameContext = {
  scene: undefined,
  balls: []
}; 