import type { Entity } from "~/routes/games/rogue0/entity";

const turnManager = {
  entityIndex: 0,

  refresh: (entities: Entity[]) => entities.forEach((e) => {
    e.refresh();
    turnManager.entityIndex = 0;
  }),

  turn: (entities: Entity[]) => {
    if (entities.length === 0 || !entities) {
      return;
    }

    let e = entities[turnManager.entityIndex];

    if (!e.isOver()) {
      e.turn();
    } else {
      turnManager.entityIndex++;
    }
  },

  isOver: (entities: Entity[]) => entities.every((e) => e.isOver())
};

export default turnManager;
