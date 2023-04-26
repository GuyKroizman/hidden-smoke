import type { Entity } from "~/routes/games/rogue0/turnManager.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import PF from "pathfinding";
import level from "../level.client.js";

export default class Skeleton implements Entity{
  private movementPoints: number;
  x: number;
  y: number;
  tile: number;
  sprite: Phaser.GameObjects.Sprite;
  private context: GameContext;
  moving: boolean;

  constructor(context: GameContext, x: number, y: number) {
    if (context.map == undefined || context.scene == undefined || context.player == undefined) {
      throw new Error("Error in Skeleton context is undefined");
    }
    this.context = context
    this.movementPoints = 1
    this.x = x
    this.y = y
    this.tile = 26
    this.moving = false

    let worldX = context.map.tileToWorldX(x)
    let worldY = context.map.tileToWorldY(y)
    this.sprite = context.scene.add.sprite(worldX, worldY, "tiles", this.tile)
    this.sprite.setOrigin(0)
  }

  refresh() {
    this.movementPoints = 1
  }

  turn() {
    let oldX = this.x
    let oldY = this.y

    if (this.movementPoints > 0) {
      // https://github.com/qiao/PathFinding.js
      let pX = this.context.player!.x
      let pY = this.context.player!.y
      let grid = new PF.Grid(level)
      let finder = new PF.AStarFinder()
      let path = finder.findPath(oldX, oldY, pX, pY, grid)

      if (path.length > 2) {
        dungeon.moveEntityTo(this.context, this, path[1][0], path[1][1])
      }

      this.movementPoints -= 1
    }
  }

  over() {
    return this.movementPoints == 0 && !this.moving
  }
}
