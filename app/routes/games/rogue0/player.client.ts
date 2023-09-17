import type { GameContext } from "~/routes/games/rogue0/context.client";
import dungeon from "~/routes/games/rogue0/dungeon.client";

import type { Entity, EntityType } from "~/routes/games/rogue0/entity";
import Sword from "~/routes/games/rogue0/items/sword";

export default class PlayerCharacter implements Entity {
  private movementPoints: number;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  x: number;
  y: number;
  name: string;
  description: string = "A brave adventurer";
  type: EntityType;
  healthPoints: number;
  actionPoints: number;
  tweens: number = 0;
  UISprite?: Phaser.GameObjects.Sprite;
  UIHeader?: Phaser.GameObjects.Text;
  UIStatsText?: Phaser.GameObjects.Text;
  UIItems?: Phaser.GameObjects.Rectangle[] = [];
  tile: number;
  moving: boolean = false;
  sprite: Phaser.GameObjects.Sprite;
  items: any[] = [];
  UIScene?: Phaser.Scene;

  constructor(context: GameContext, x: number, y: number) {
    if (context.map == undefined || context.scene == undefined) {
      throw new Error("Error in PlayerCharacter context is undefined");
    }

    this.movementPoints = 1;
    this.cursors = context.scene!.input.keyboard!.createCursorKeys();
    this.x = x;
    this.y = y;
    this.tile = 26;
    this.healthPoints = 30;
    this.name = "Player";
    this.type = "player";
    this.actionPoints = 1;

    this.items.push(new Sword(context));
    this.toggleItem(context, 0);

    let worldX = context.map.tileToWorldX(x);
    let worldY = context.map.tileToWorldY(y);
    this.sprite = context.scene.add.sprite(worldX!, worldY!, "tiles", this.tile);
    this.sprite.setOrigin(0);

    context.scene!.input.keyboard!.on("keyup", (event: KeyboardEvent) => {

      let key = event.key;

      let keyNumber = Number(key);
      if (!isNaN(keyNumber)) {

        if (keyNumber == 0) {
          keyNumber = 10;
        }

        this.toggleItem(context, keyNumber - 1);
      }
    });
  }

  toggleItem(context: GameContext, itemNumber: number) {
    const item = this.items[itemNumber];
    if (!item) {
      return;
    }
    if (item.weapon) {
      this.items.forEach(i => i.active = i.weapon ? false : i.active);
    }
    item.active = !item.active;
    if (item.active) {
      dungeon.log(context, `${this.name} equips ${item.name}: ${item.description}.`);
      item.equip(itemNumber);
    }
  }

  removeItem(itemNumber: number) {
    const item = this.items[itemNumber];

    if (item) {
      this.items.forEach(i => {
        i.UIsprite.destroy();
        delete i.UIsprite;
      });
      this.items = this.items.filter(i => i !== item);
      this.refreshUI();
    }

  }

  removeItemByProperty(property: string, value: any) {
    this.items.forEach(i => {
      i.UIsprite.destroy();
      delete i.UIsprite;
    });
    this.items = this.items.filter(i => i[property] !== value);
    this.refreshUI();
  }

  equippedItems() {
    return this.items.filter(i => i.active);
  }

  refreshUI() {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (!item.UIsprite) {
        let x = this.UIItems![i].x + 10;
        let y = this.UIItems![i].y + 10;
        item.UIsprite = this.UIScene?.add.sprite(x, y, "tiles", item.tile);
      }
      if (!item.active) {
        item.UIsprite.setAlpha(0.5);
        this.UIItems![i].setStrokeStyle();
      } else {
        item.UIsprite.setAlpha(1);
        this.UIItems![i].setStrokeStyle(1, 0xffffff);
      }
    }
  }

  attack() {
    const items = this.equippedItems();
    const combineDamage = (total: number, item: Entity) => total + item.damage();

    return items.reduce(combineDamage, 0);
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
    let oldX = this.x;
    let oldY = this.y;
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
          let entity = dungeon.entityAtTile(context, newX, newY);

          if (entity && entity.type === "enemy" && this.actionPoints > 0) {
            dungeon.attackEntity(context, this, entity);
            this.actionPoints -= 1;
          }

          if (entity && entity.type === "item" && this.actionPoints > 0) {
            this.items.push(entity);
            dungeon.itemPicked(entity);
            dungeon.log(context, `${this.name} picked ${entity.name}: ${entity.description}`);
            this.actionPoints -= 1;
          } else {
            newX = oldX;
            newY = oldY;
          }
        }
      }
      if (newX !== oldX || newY !== oldY) {
        dungeon.moveEntityTo(context, this, newX, newY);
      }
    }


    if (this.healthPoints <= 6) {
      this.sprite.tint = Phaser.Display.Color.GetColor(255, 0, 0);
    }

    this.refreshUI();
  }

  damage(): number {
    return 0;
  }

  over() {
    let isOver = this.movementPoints == 0 && !this.moving;

    if (this.UIHeader) {
      if (isOver) {
        this.UIHeader.setColor("#cfc6b8");
      } else {
        this.UIHeader.setColor("#fff");
      }
    }

    if (this.UIStatsText) {
      this.UIStatsText.setText(`Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`);
    }
    return isOver;
  }

  createUI({ scene, x, y }: {
    scene: Phaser.Scene;
    x: number;
    y: number
  }) {
    this.UIScene = scene;
    let accumulatedHeight = 0;
    // Character sprite and name
    this.UISprite = scene.add.sprite(x, y, "tiles", this.tile).setOrigin(0);

    this.UIHeader = scene.add.text(
      x + 20,
      y,
      this.name,
      {
        font: "16px Arial",
        color: "#cfc6b8"
      });


    // Character stats
    this.UIStatsText = scene.add.text(
      x + 20,
      y + 20,
      `Hp: ${this.healthPoints}\nMp: ${this.movementPoints}\nAp: ${this.actionPoints}`,
      {
        font: "12px Arial",
        backgroundColor: "#cfc6b8"
      });

    accumulatedHeight += this.UIStatsText.height + this.UISprite.height;

    // Inventory screen
    let itemsPerRow = 5;
    let rows = 2;
    this.UIItems = [];

    for (let row = 1; row <= rows; row++) {
      for (let cell = 1; cell <= itemsPerRow; cell++) {
        let rx = x + (25 * cell);
        let ry = y + 50 + (25 * row);
        this.UIItems.push(
          scene.add.rectangle(rx, ry, 20, 20, 0xcfc6b8, 0.3).setOrigin(0)
        );
      }
    }

    accumulatedHeight += 90;

    // Separator
    scene.add.line(x + 5, y + 120, 0, 10, 175, 10, 0xcfc6b8).setOrigin(0);

    return accumulatedHeight;
  }
}
