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
  interval: 150,
  entities: new Set<PlayerCharacter>(),
  lastCall: Date.now(),

  addEntity: (entity: PlayerCharacter) => turnManager.entities.add(entity),

  removeEntity: (entity: PlayerCharacter) =>
    turnManager.entities.delete(entity),

  refresh: () => turnManager.entities.forEach((e) => e.refresh()),

  turn: (context: GameContext) => {
    let now = Date.now();
    let limit = turnManager.lastCall + turnManager.interval;
    if (now > limit) {
      for (let e of turnManager.entities) {
        if (!e.over()) {
          e.turn(context)
          break;
        }
      }
      turnManager.lastCall = Date.now()
    }
  },
  over: () => [...turnManager.entities].every((e) => e.over()),
};

export default turnManager
