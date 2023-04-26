import type PlayerCharacter from "~/routes/games/rogue0/player.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";

export interface Entity {
  x: number;
  y: number;
  moving: boolean;
  sprite: Phaser.GameObjects.Sprite;
  tile: number;

  refresh(): void;

  turn(context: GameContext): void;

  over(): boolean;
}

const turnManager = {
  entities: new Set<Entity>(),
  currentIndex: 0,

  addEntity: (entity: Entity) => turnManager.entities.add(entity),

  removeEntity: (entity: PlayerCharacter) =>
    turnManager.entities.delete(entity),

  refresh: () => turnManager.entities.forEach((e) => {
    e.refresh();
    turnManager.currentIndex = 0
  }),

  turn: (context: GameContext) => {
    if (turnManager.entities.size === 0) {
      return;
    }

    let entitiesList = [...turnManager.entities];
    let e = entitiesList[turnManager.currentIndex];

    if (!e.over()) {
      e.turn(context);
    } else {
      turnManager.currentIndex++;
    }
  },

  over: () => [...turnManager.entities].every((e) => e.over()),
};

export default turnManager;
