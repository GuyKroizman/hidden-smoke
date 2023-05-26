import type { GameContext } from "~/routes/games/rogue0/context.client";

export interface Entity {
  healthPoints: number;
  tweens: number;
  x: number;
  y: number;
  moving: boolean;
  sprite: Phaser.GameObjects.Sprite;
  tile: number;
  name: string;

  refresh(): void;

  turn(context: GameContext): void;

  over(): boolean;

  attack(): number;

  onDestroy(): void;
}

export function removeEntity(context: GameContext, entity: Entity) {
  const victimIndexInEntities = context.entities.findIndex(() => entity);
  context.entities.splice(victimIndexInEntities, 1);

  entity.sprite.destroy();

  entity.onDestroy();
}
