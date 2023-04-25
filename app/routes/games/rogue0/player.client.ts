import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";
import type { Entity } from "./turnManager.client";

export default class PlayerCharacter implements Entity{
  private movementPoints: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  x: number;
  y: number;
  tile: number;
  hp: number;
  moving: boolean;
  sprite: Phaser.GameObjects.Sprite;

  constructor(x: number, y: number, context: GameContext) {
    if (context.map == undefined || context.scene == undefined) {
      throw new Error("context.map is undefined");
    }

    this.movementPoints = 1
    this.cursors = context.scene!.input.keyboard.createCursorKeys()
    this.x = x
    this.y = y
    this.tile = 29;
    this.hp = 10;
    this.moving = false;

    let xx = context.map.tileToWorldX(x)
    let yy = context.map.tileToWorldY(y)
    this.sprite = context.scene.add.sprite(xx, yy, "tiles", this.tile)
    this.sprite.setOrigin(0)

    context.map!.putTileAt(this.tile, this.x, this.y)
  }

  refresh() {
    this.movementPoints = 1
  }

  turn(context: GameContext) {
    let moved = false
    let newX = this.x
    let newY = this.y

    if (this.movementPoints > 0 && !this.moving) {
      if (this.cursors.left.isDown) {
        newX -= 1
        moved = true
      }

      if (this.cursors.right.isDown) {
        newX += 1
        moved = true
      }

      if (this.cursors.up.isDown) {
        newY -= 1
        moved = true
      }

      if (this.cursors.down.isDown) {
        newY += 1
        moved = true
      }

      if (moved) {
        this.movementPoints -= 1

        if (dungeon.isWalkableTile(newX, newY)) {
          dungeon.moveEntityTo(context, this, newX, newY)
        }
      }


    }

    if (this.hp <= 3) {
      this.sprite.tint = Phaser.Display.Color.GetColor(255,0,0)
    }

  }

  over() {
    return this.movementPoints == 0 && !this.moving
  }
}
