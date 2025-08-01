import Phaser from "phaser";
import type { HootGameContext } from "./context.client";

export class HootScene extends Phaser.Scene {
  context: HootGameContext;
  private mouseIndicator?: Phaser.GameObjects.Graphics;

  constructor(context: HootGameContext) {
    super("hoot-scene");
    this.context = context;
  }

  preload() {
    // Load assets here if needed
  }

  create() {
    console.log("Hoot scene created!");
    this.context.scene = this;

    // Add instructions
    this.add.text(400, 50, "Rope Physics Demo", {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);

    // Add mouse interaction with better debugging
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      console.log("Mouse clicked at:", pointer.x, pointer.y);
      console.log("Rope segments available:", this.context.ropeSegments.length);
      this.attachRopeToMouse(pointer.x, pointer.y);
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.updateMousePosition(pointer.x, pointer.y);
    });

    // Add a status text
    this.add.text(400, 110, "Status: Ready to click", {
      fontSize: "14px",
      color: "#ffff00"
    }).setOrigin(0.5);
  }

  update() {
    this.updateRope();
    this.updateMouseIndicator();
  }

  createRope() {
    console.log("Creating rope...");

    // Rope properties
    const ropeLength = 10; // Number of segments
    const segmentSize = 8; // Size of each segment
    const startX = 400; // Starting X position
    const startY = 100; // Starting Y position

    // Create rope segments
    for (let i = 0; i < ropeLength; i++) {
      // Create a circle for each segment
      const segment = this.add.circle(
        startX,
        startY + (i * segmentSize),
        segmentSize / 2,
        0x00ff00 // Green color
      );

      // Add physics body to the segment
      this.physics.add.existing(segment);

      // Make the first segment static (anchor point)
      if (i === 0) {
        (segment.body as Phaser.Physics.Arcade.Body).setImmovable(true);
      }

      // Store segment in context
      this.context.ropeSegments.push(segment);
      console.log(`Created segment ${i} at (${startX}, ${startY + (i * segmentSize)})`);
    }

    // Create connections between segments using distance-based constraints
    for (let i = 0; i < this.context.ropeSegments.length - 1; i++) {
      const current = this.context.ropeSegments[i];
      const next = this.context.ropeSegments[i + 1];

      // Add collision between segments
      this.physics.add.collider(current, next);
    }

    console.log(`Created ${this.context.ropeSegments.length} rope segments`);
  }

  updateRope() {
    // Update rope physics
    if (this.context.ropeSegments.length > 0) {
      // Apply some damping to make the rope more stable
      this.context.ropeSegments.forEach((segment: any) => {
        const body = segment.body as Phaser.Physics.Arcade.Body;
        if (body && body.velocity) {
          body.velocity.x *= 0.98;
          body.velocity.y *= 0.98;
        }
      });

      // Update the last segment if mouse is attached
      if (this.context.isMouseAttached) {
        const lastSegment = this.context.ropeSegments[this.context.ropeSegments.length - 1] as Phaser.GameObjects.GameObject & { setPosition: (x: number, y: number) => void };
        lastSegment.setPosition(this.context.mousePosition.x, this.context.mousePosition.y);
        (lastSegment.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      }
    }
  }

  updateMouseIndicator() {
    if (this.mouseIndicator) {
      this.mouseIndicator.clear();

      if (this.context.isMouseAttached) {
        // Draw a red circle at mouse position when attached
        this.mouseIndicator.lineStyle(2, 0xff0000);
        this.mouseIndicator.strokeCircle(
          this.context.mousePosition.x,
          this.context.mousePosition.y,
          15
        );
      }
    }
  }

  attachRopeToMouse(x: number, y: number) {
    console.log("Attempting to attach rope to mouse...");
    // Attach the last segment of the rope to the mouse position
    if (this.context.ropeSegments.length > 0) {
      this.context.isMouseAttached = true;
      this.context.mousePosition = { x, y };
      const lastSegment = this.context.ropeSegments[this.context.ropeSegments.length - 1] as Phaser.GameObjects.GameObject & { setPosition: (x: number, y: number) => void };
      lastSegment.setPosition(x, y);
      (lastSegment.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      console.log("Rope attached to mouse at:", x, y);
    } else {
      console.log("No rope segments available!");
    }
  }

  updateMousePosition(x: number, y: number) {
    // Update the position of the last segment to follow the mouse
    this.context.mousePosition = { x, y };
    if (this.context.isMouseAttached && this.context.ropeSegments.length > 0) {
      const lastSegment = this.context.ropeSegments[this.context.ropeSegments.length - 1] as Phaser.GameObjects.GameObject & { setPosition: (x: number, y: number) => void };
      lastSegment.setPosition(x, y);
    }
  }
} 
