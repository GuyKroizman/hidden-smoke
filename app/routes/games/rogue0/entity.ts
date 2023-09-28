import type { GameContext } from "~/routes/games/rogue0/context.client";

export type EntityType = "player" | "enemy" | "item";

export abstract class Entity {
  healthPoints: number = 0;
  tweens: number = 0;
  x?: number;
  y?: number;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite | undefined;
  tile: number = 0;
  name: string = "Unknown Entity";
  description: string = "Unknown Entity Description";
  type: EntityType = "enemy";
  UISprite?: Phaser.GameObjects.Sprite;
  UIText?: Phaser.GameObjects.Text;
  context!: GameContext;

  init(context: GameContext, x?: number, y?: number) {

    this.x = x;
    this.y = y;
    this.context = context;

    if (this.x && this.y) {
      const x = context.map!.tileToWorldX(this.x);
      const y = context.map!.tileToWorldY(this.y);
      this.sprite = context.scene!.add.sprite(x || 0, y || 0, "tiles", this.tile);
      this.sprite.setOrigin(0);
    } else {
      this.sprite = undefined;
    }
  }

  abstract refresh(): void;

  abstract turn(context: GameContext): void;

  abstract over(): boolean;

  abstract attack(): number;

  abstract damage(): number;

  abstract onDestroy(): void;

  createUI?(options: { scene: Phaser.Scene, x: number, y: number, width: number }): number;
}

export function removeEntity(context: GameContext, entity: Entity) {
  const victimIndexInEntities = context.entities.findIndex((e) => e === entity);
  context.entities.splice(victimIndexInEntities, 1);

  entity.sprite?.destroy();

  entity.onDestroy();
}
