import type { GameContext } from "~/routes/games/rogue0/context.client";
import { Sprites } from "~/routes/games/rogue0/dungeon.client";

export default class PlayerCharacter {
  private movementPoints: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private x: number;
  private y: number;
  private readonly sprite: number;

  constructor(x: number, y: number, context: GameContext) {
    this.movementPoints = 1
    this.cursors = context.scene!.input.keyboard.createCursorKeys()
    this.x = x
    this.y = y
    this.sprite = 29

    context.map!.putTileAt(this.sprite, this.x, this.y)
  }

  refresh() {
    this.movementPoints = 1
  }

  turn(context: GameContext) {
    let oldX = this.x
    let oldY = this.y
    let moved = false

    if (this.movementPoints > 0) {
      if (this.cursors.left.isDown) {
        this.x -= 1
        moved = true
      }

      if (this.cursors.right.isDown) {
        this.x += 1
        moved = true
      }

      if (this.cursors.up.isDown) {
        this.y -= 1
        moved = true
      }

      if (this.cursors.down.isDown) {
        this.y += 1
        moved = true
      }

      if (moved) {
        this.movementPoints -= 1
      }
    }

    // wall collision check
    let tileAtDestination = context.map!.getTileAt(this.x, this.y)
    if (tileAtDestination.index == Sprites.wall) {
      this.x = oldX
      this.y = oldY
    }

    // tile movement code
    if (this.x !== oldX || this.y !== oldY) {
      context.map!.putTileAt(this.sprite, this.x, this.y)
      context.map!.putTileAt(Sprites.floor, oldX, oldY)
    }
  }

  over() {
    return this.movementPoints == 0
  }
}
