import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";

import type { Entity } from "~/routes/games/rogue0/entity";

export default class PlayerCharacter implements Entity {
  private movementPoints: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  x: number;
  y: number;
  name: string;
  healthPoints: number;
  actionPoints: number;
  tweens: number;
  UISprite?: Phaser.GameObjects.Sprite;
  UIHeader?: Phaser.GameObjects.Text;
  UIStatsText?: Phaser.GameObjects.Text;
  UIItems?: Phaser.GameObjects.Rectangle[];
  tile: number;
  moving: boolean;
  sprite: Phaser.GameObjects.Sprite;

  constructor(x: number, y: number, context: GameContext) {
    if (context.map == undefined || context.scene == undefined) {
      throw new Error("Error in PlayerCharacter context is undefined");
    }

    this.movementPoints = 1;
    this.cursors = context.scene!.input.keyboard!.createCursorKeys();
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
    this.sprite = context.scene.add.sprite(worldX!, worldY!, "tiles", this.tile);
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
    let oldX = this.x
    let oldY = this.y
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

        if (!dungeon.isWalkableTile(context, newX, newY)) {
          let enemy = dungeon.entityAtTile(context, newX, newY);

          if (enemy && this.actionPoints > 0) {
            dungeon.attackEntity(context, this, enemy);
            this.actionPoints -= 1;
          }
          newX = oldX;
          newY = oldY;
        }
        if (newX !== oldX || newY !== oldY) {
          dungeon.moveEntityTo(context, this, newX, newY);
        }
      }
    }

    if (this.healthPoints <= 6) {
      this.sprite.tint = Phaser.Display.Color.GetColor(255, 0, 0);
    }
  }

  over() {
    let isOver = this.movementPoints == 0 && !this.moving

    if (this.UIHeader){
      if (isOver ) {
        this.UIHeader.setColor("#cfc6b8")
      } else {
        this.UIHeader.setColor("#fff")
      }
    }

    if (this.UIStatsText) {
      this.UIStatsText.setText( `Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`)
    }
    return isOver
  }

  createUI({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    let accumulatedHeight = 0;
    // Character sprite and name
    this.UISprite = scene.add.sprite(x, y, "tiles", this.tile).setOrigin(0)

    this.UIHeader = scene.add.text(
      x + 20,
      y,
      this.name,
      {
        font: '16px Arial',
        color: '#cfc6b8'
      })


    // Character stats
    this.UIStatsText = scene.add.text(
      x + 20,
      y + 20,
      `Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`,
      {
        font: '12px Arial',
        backgroundColor: '#cfc6b8'
      })

    accumulatedHeight += this.UIStatsText.height + this.UISprite.height

    // Inventory screen
    let itemsPerRow = 5
    let rows = 2
    this.UIItems = []

    for (let row = 1; row <= rows; row++) {
      for (let cell = 1; cell <= itemsPerRow; cell++) {
        let rx = x + (25 * cell)
        let ry = y + 50 + (25 * row)
        this.UIItems.push(
          scene.add.rectangle(rx, ry, 20, 20, 0xcfc6b8, 0.3).setOrigin(0)
        )
      }
    }

    accumulatedHeight += 90

    // Separator
    scene.add.line(x+5, y+120, 0, 10, 175, 10, 0xcfc6b8).setOrigin(0)

    return accumulatedHeight
  }
}
