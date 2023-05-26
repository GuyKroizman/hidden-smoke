import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";

import { Entity } from "~/routes/games/rogue0/entity";

export default class PlayerCharacter implements Entity {
  private movementPoints: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  x: number;
  y: number;
  name: string;
  healthPoints: number;
  actionPoints: number;
  tweens: number;
  tile: number;
  moving: boolean;
  sprite: Phaser.GameObjects.Sprite;

  constructor(x: number, y: number, context: GameContext) {
    if (context.map == undefined || context.scene == undefined) {
      throw new Error("Error in PlayerCharacter context is undefined");
    }

    this.movementPoints = 1;
    this.cursors = context.scene!.input.keyboard.createCursorKeys();
    this.x = x;
    this.y = y;
    this.tile = 29;
    this.healthPoints = 15;
    this.moving = false;
    this.name = "Player";
    this.tweens = 0;
    this.actionPoints = 1;

    let worldX = context.map.tileToWorldX(x);
    let worldY = context.map.tileToWorldY(y);
    this.sprite = context.scene.add.sprite(worldX, worldY, "tiles", this.tile);
    this.sprite.setOrigin(0);
  }

  attack(): number {
    return 1;
  }

  onDestroy(): void {
    alert("You died!");
    location.reload();
  }

  refresh() {
    this.movementPoints = 1;
    this.actionPoints = 1;
  }

  turn(context: GameContext) {
    let moved = false;
    let newX = this.x;
    let newY = this.y;

    if (this.movementPoints > 0 && !this.moving) {
      if (this.cursors.left.isDown) {
        newX -= 1;
        moved = true;
      }

      if (this.cursors.right.isDown) {
        newX += 1;
        moved = true;
      }

      if (this.cursors.up.isDown) {
        newY -= 1;
        moved = true;
      }

      if (this.cursors.down.isDown) {
        newY += 1;
        moved = true;
      }

      if (moved) {
        this.movementPoints -= 1;

        if (dungeon.isWalkableTile(context, newX, newY)) {
          dungeon.moveEntityTo(context, this, newX, newY);
        }
      }
    }

    if (this.healthPoints <= 3) {
      this.sprite.tint = Phaser.Display.Color.GetColor(255, 0, 0);
    }
  }

  over() {
    return this.movementPoints == 0 && !this.moving;
  }
}
