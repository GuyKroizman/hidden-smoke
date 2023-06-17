import type { GameContext } from "~/routes/games/rogue0/context.client";

export type EntityType = "player" | "enemy";

export interface Entity {
  healthPoints: number;
  tweens: number;
  x: number;
  y: number;
  moving: boolean;
  sprite: Phaser.GameObjects.Sprite;
  tile: number;
  name: string;
  type: EntityType;
  UISprite?: Phaser.GameObjects.Sprite;
  UIText?: Phaser.GameObjects.Text;

  refresh(): void;

  turn(context: GameContext): void;

  over(): boolean;

  attack(): number;

  onDestroy(): void;

  createUI?(options: { scene: Phaser.Scene, x: number, y: number, width: number }): number;
}

export function removeEntity(context: GameContext, entity: Entity) {
  const victimIndexInEntities = context.entities.findIndex((e) => e === entity);
  context.entities.splice(victimIndexInEntities, 1);

  entity.sprite.destroy();

  entity.onDestroy();
}
