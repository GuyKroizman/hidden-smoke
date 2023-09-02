import dungeon from "~/routes/games/rogue0/dungeon.client";
import type { GameContext } from "~/routes/games/rogue0/context.client";
import PF from "pathfinding";
import level from "../level.client.js";
import type { Entity, EntityType } from "~/routes/games/rogue0/entity";

export default class Skeleton implements Entity {
  private movementPoints: number;
  x: number;
  y: number;
  tile: number;
  sprite: Phaser.GameObjects.Sprite;
  private context: GameContext;
  moving: boolean;
  readonly name: string;
  description: string = "A skeleton";
  type: EntityType;
  actionPoints: number;
  healthPoints: number;
  tweens: number;
  UISprite?: Phaser.GameObjects.Sprite;
  UIText?: Phaser.GameObjects.Text;

  constructor(context: GameContext, x: number, y: number) {
    if (
      context.map == undefined ||
      context.scene == undefined ||
      context.player == undefined
    ) {
      throw new Error("Error in Skeleton context is undefined");
    }
    this.context = context;
    this.movementPoints = 1;
    this.actionPoints = 1;
    this.healthPoints = 4;
    this.x = x;
    this.y = y;
    this.tile = 26;
    this.moving = false;
    this.tweens = 0;

    let worldX = context.map.tileToWorldX(x);
    let worldY = context.map.tileToWorldY(y);
    this.sprite = context.scene.add.sprite(worldX!, worldY!, "tiles", this.tile);
    this.sprite.setOrigin(0);

    this.name = "Skeleton";
    this.type = "enemy"
  }

  refresh() {
    this.movementPoints = 1;
    this.actionPoints = 1;
  }

  turn() {
    if (!this.context.player) {
      throw new Error("Error in Skeleton context.player is undefined");
    }
    let oldX = this.x;
    let oldY = this.y;

    if (this.movementPoints > 0) {
      let pX = this.context.player!.x;
      let pY = this.context.player!.y;
      const grid = new PF.Grid(level);
      const finder = new PF.AStarFinder();
      const path = finder.findPath(oldX, oldY, pX, pY, grid);

      if (this.movementPoints > 0) {
        if (path.length > 2) {
          dungeon.moveEntityTo(this.context, this, path[1][0], path[1][1]);
        }

        this.movementPoints -= 1;
      }

      if (this.actionPoints > 0) {
        if (dungeon.distanceBetweenEntities(this, this.context.player) <= 2) {
          dungeon.attackEntity(this.context, this, this.context.player);
        }
        this.actionPoints -= 1;
      }
    }
  }

  over() {
    const isOver =
      this.movementPoints == 0 && this.actionPoints == 0 && !this.moving;

    if (this.UIText) {
      if (isOver) {
        this.UIText.setColor("#cfc6b8");
      } else {
        this.UIText.setColor("#fff");
      }
    }

    return isOver;
  }

  attack() {
    return 1;
  }

  damage() {
    return 0;
  }

  onDestroy() {
    dungeon.log(this.context,`${this.name} was killed.`)
    if(this.UISprite) {
      this.UISprite.setAlpha(0.2)

    }
    if(this.UIText) {

    this.UIText.setAlpha(0.2)
    }
  }

  createUI({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    this.UISprite = scene.add.sprite(x, y, "tiles", this.tile).setOrigin(0);
    this.UIText = scene.add.text(x + 20, y, this.name, {
      font: "16px Arial",
      backgroundColor: "#cfc6b8",
    });

    return 30;
  }
}
