import dungeon from "~/routes/games/rogue0/dungeon.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import PF from "pathfinding";
import level from "../level.client.js";
import type { Entity } from "~/routes/games/rogue0/entity";

export default class Skeleton implements Entity{
  private movementPoints: number;
  x: number;
  y: number;
  tile: number;
  sprite: Phaser.GameObjects.Sprite;
  private context: GameContext;
  moving: boolean;
  readonly name: string;
  actionPoints: number;
  healthPoints: number;
  tweens: number;

  constructor(context: GameContext, x: number, y: number) {
    if (context.map == undefined || context.scene == undefined || context.player == undefined) {
      throw new Error("Error in Skeleton context is undefined");
    }
    this.context = context
    this.movementPoints = 1
    this.actionPoints = 1
    this.healthPoints = 1
    this.x = x
    this.y = y
    this.tile = 26
    this.moving = false
    this.tweens = 0

    let worldX = context.map.tileToWorldX(x)
    let worldY = context.map.tileToWorldY(y)
    this.sprite = context.scene.add.sprite(worldX, worldY, "tiles", this.tile)
    this.sprite.setOrigin(0)

    this.name = "Skeleton"
  }

  refresh() {
    this.movementPoints = 1
    this.actionPoints = 1
  }

  turn() {
    let oldX = this.x
    let oldY = this.y

    if (this.movementPoints > 0) {
      // https://github.com/qiao/PathFinding.js
      let pX = this.context.player!.x
      let pY = this.context.player!.y
      const grid = new PF.Grid(level)
      const finder = new PF.AStarFinder()
      const path = finder.findPath(oldX, oldY, pX, pY, grid)

      if(this.movementPoints > 0) {
        if (path.length > 2) {
          dungeon.moveEntityTo(this.context, this, path[1][0], path[1][1])
        }

        this.movementPoints -= 1
      }

      if (this.actionPoints > 0) {
        if (dungeon.distanceBetweenEntities(this, this.context.player) <= 2) {
          dungeon.attackEntity(this, this.context.player)
          this.actionPoints -= 1
        }
      }
    }
  }

  over() {
    return this.movementPoints == 0 && this.actionPoints == 0 && !this.moving
  }

  attack() {
    return 1
  }

  onDestroy() {
    console.log(`${this.name} is destroyed`)
  }
}
