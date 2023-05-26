import type { GameContext } from "~/routes/games/rogue0/context.client";

const turnManager = {
  entities: [],
  currentIndex: 0,

  refresh: (context: GameContext) => context.entities.forEach((e) => {
    e.refresh();
    turnManager.currentIndex = 0
  }),

  turn: (context: GameContext) => {
    if (context.entities.length === 0 || !context.entities) {
      return;
    }

    let e = context.entities[turnManager.currentIndex];

    if (!e.over()) {
      e.turn(context);
    } else {
      turnManager.currentIndex++;
    }
  },

  over: (context: GameContext) => context.entities.every((e) => e.over()),
};

export default turnManager;
