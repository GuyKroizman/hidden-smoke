import Phaser from "phaser";
import type { HootGameContext } from "./context.client";

export class HootGameScene extends Phaser.Scene {
  context: HootGameContext;
  private weight?: Phaser.GameObjects.GameObject;
  private frameCount: number = 0;
  private ropeLines: Phaser.GameObjects.Graphics[] = [];
  private segmentConnections: Array<{
    segment1: Phaser.GameObjects.Shape;
    segment2: Phaser.GameObjects.Shape;
    distance: number;
  }> = [];

  constructor(context: HootGameContext) {
    super("hoot-game-scene");
    this.context = context;
  }

  preload() {
    // Load assets here if needed
  }

  create() {
    if (!this.context) {
      console.error("Context is undefined!");
      return;
    }
    this.context.scene = this;

    this.createRope();
    this.createBalls();
  }

  update() {
    // if (this.frameCount > 500) {
    //   return;
    // }
    // Debug: Log that update is running
    // if (this.frameCount % 30 === 0) {
    //   console.log(`Update running, time: ${this.time.now.toFixed(0)}, segments: ${this.context.ropeSegments.length}`);
    // }

    this.frameCount++;

    this.updateRope();
    this.updateBalls();
    this.checkBallRopeCollisions();
  }

  createRope() {

    const ropeLength = 10; // Number of segments
    const segmentSize = 8; // Size of each segment (circle radius)
    const lineLength = 20; // Distance between segments
    const startX = 400; // Starting X position
    const startY = 100; // Starting Y position

    const anchor = this.add.circle(startX, startY, 6, 0xff00ff); // Anchor point
    (anchor as Phaser.GameObjects.GameObject & { setDepth: (depth: number) => void }).setDepth(1000);

    // Create rope segments with custom physics data
    for (let i = 0; i < ropeLength; i++) {
      const segment = this.add.circle(
        startX,
        startY + (i * lineLength), // Use lineLength for spacing
        segmentSize / 2,
        0x00ff00
      );

      // Add custom physics properties
      (segment as any).velocityX = 0;
      (segment as any).velocityY = 0;
      (segment as any).mass = 1;
      (segment as any).radius = segmentSize / 2;
      (segment as any).isAnchor = i === 0; // First segment is anchor

      this.context.ropeSegments.push(segment);
      console.log(`Created segment ${i} at (${startX}, ${startY + (i * lineLength)}) with isAnchor: ${i === 0}`);
    }

    // Store segment connections for constraint updates
    this.segmentConnections = [];
    for (let i = 0; i < this.context.ropeSegments.length - 1; i++) {
      const segment1 = this.context.ropeSegments[i];
      const segment2 = this.context.ropeSegments[i + 1];

      // Calculate actual distance between segments
      const dx = segment2.x - segment1.x;
      const dy = segment2.y - segment1.y;
      const actualDistance = Math.sqrt(dx * dx + dy * dy);

      console.log(`Initial distance between segments ${i} and ${i + 1}: ${actualDistance.toFixed(1)} (target: ${lineLength})`);

      this.segmentConnections.push({
        segment1: segment1,
        segment2: segment2,
        distance: lineLength // Use lineLength for constraint distance
      });
    }

    console.log(`Created ${this.context.ropeSegments.length} rope segments`);
    this.context.ropeSegments.forEach((segment: any, index: number) => {
      console.log(`Initial Segment ${index}: pos(${segment.x.toFixed(1)}, ${segment.y.toFixed(1)})`);
    });

    // Create visual lines between segments
    this.createRopeLines();

    // Create a visual weight at the end of the rope
    // const lastSegment = this.context.ropeSegments[this.context.ropeSegments.length - 1];
    // this.weight = this.add.circle(
    //   lastSegment.x,
    //   lastSegment.y + 15,
    //   8,
    //   0x8B4513 // Brown color for weight
    // );
    // (this.weight as any).setDepth(999);
  }

  createRopeLines() {
    // Clear any existing lines
    this.ropeLines.forEach(line => line.destroy());
    this.ropeLines = [];

    // Create lines between each pair of segments
    for (let i = 0; i < this.context.ropeSegments.length - 1; i++) {
      const segment1 = this.context.ropeSegments[i];
      const segment2 = this.context.ropeSegments[i + 1];

      const line = this.add.graphics();
      line.lineStyle(2, 0x8B4513); // Brown color, 2px width
      line.beginPath();
      line.moveTo(segment1.x, segment1.y);
      line.lineTo(segment2.x, segment2.y);
      line.strokePath();
      line.setDepth(500); // Behind the segments

      this.ropeLines.push(line);
    }
  }

  updateRopeLines() {
    // Update line positions to follow segments
    for (let i = 0; i < this.ropeLines.length; i++) {
      const line = this.ropeLines[i];
      const segment1 = this.context.ropeSegments[i];
      const segment2 = this.context.ropeSegments[i + 1];

      line.clear();
      line.lineStyle(2, 0x8B4513);
      line.beginPath();
      line.moveTo(segment1.x, segment1.y);
      line.lineTo(segment2.x, segment2.y);
      line.strokePath();
    }
  }

  createBalls() {
    console.log("Creating bouncing balls...");

    // Create several bouncing balls
    for (let i = 0; i < 5; i++) {
      const ball = this.add.circle(
        100 + Math.random() * 600, // Random X position
        50 + Math.random() * 200,  // Random Y position
        12, // Ball radius
        0xff0000 // Red color
      );

      // Add custom physics properties
      (ball as any).velocityX = (Math.random() - 0.5) * 4; // Random horizontal velocity
      (ball as any).velocityY = (Math.random() - 0.5) * 4; // Random vertical velocity
      (ball as any).mass = 2;
      (ball as any).radius = 12;

      this.context.balls.push(ball);
      console.log(`Created ball ${i} at (${ball.x}, ${ball.y}) with velocity (${(ball as any).velocityX.toFixed(2)}, ${(ball as any).velocityY.toFixed(2)})`);
    }
  }

  updateRope() {
    // Debug: Log that updateRope is being called
    if (this.frameCount % 30 === 0) {
      console.log(`updateRope called, segments: ${this.context.ropeSegments.length}`);
    }

    if (this.context.ropeSegments.length > 0) {
      // Update segment positions based on velocities
      this.context.ropeSegments.forEach((segment: any, index: number) => {
        if (!segment.isAnchor) {
          // Apply stronger damping to velocities
          segment.velocityX *= 0.85;
          segment.velocityY *= 0.85;

          // Update position based on velocity
          segment.x += segment.velocityX;
          segment.y += segment.velocityY;

          // Keep segments within bounds
          segment.x = Math.max(20, Math.min(780, segment.x));
          segment.y = Math.max(20, Math.min(580, segment.y));
        }
      });

      // Apply constraints multiple times to keep rope together
      for (let i = 0; i < 10; i++) {
        this.updateConstraints();
      }

      // Update rope lines to follow segments
      this.updateRopeLines();

      // Update weight position to follow the last segment
      const lastSegment = this.context.ropeSegments[this.context.ropeSegments.length - 1];
      if (this.weight && this.context.ropeSegments.length > 0) {
        (this.weight as any).setPosition(lastSegment.x, lastSegment.y + 15);
      }
    }
  }

  updateBalls() {
    // Update ball physics
    this.context.balls.forEach((ball: any) => {
      // Apply damping
      ball.velocityX *= 0.995;
      ball.velocityY *= 0.995;

      // Update position
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      // Bounce off walls
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.velocityX *= -0.8;
      }
      if (ball.x + ball.radius > 800) {
        ball.x = 800 - ball.radius;
        ball.velocityX *= -0.8;
      }
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.velocityY *= -0.8;
      }
      if (ball.y + ball.radius > 600) {
        ball.y = 600 - ball.radius;
        ball.velocityY *= -0.8;
      }
    });
  }

  checkBallRopeCollisions() {
    // Check collisions between balls and rope segments
    this.context.balls.forEach((ball: any) => {
      this.context.ropeSegments.forEach((segment: any) => {
        if (!segment.isAnchor) {
          const dx = ball.x - segment.x;
          const dy = ball.y - segment.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ball.radius + segment.radius;

          if (distance < minDistance) {
            // Collision detected! Transfer energy from ball to rope
            const angle = Math.atan2(dy, dx);

            // Push ball away from segment
            ball.x = segment.x + Math.cos(angle) * minDistance;
            ball.y = segment.y + Math.sin(angle) * minDistance;

            // Transfer momentum from ball to rope segment (much gentler)
            const ballSpeed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);
            const transferFactor = 0.05; // Much smaller transfer factor

            // Add velocity to rope segment (capped to prevent extreme responses)
            const maxSegmentVelocity = 3; // Maximum velocity for segments
            const newSegmentVelX = ball.velocityX * transferFactor;
            const newSegmentVelY = ball.velocityY * transferFactor;

            segment.velocityX += Math.max(-maxSegmentVelocity, Math.min(maxSegmentVelocity, newSegmentVelX));
            segment.velocityY += Math.max(-maxSegmentVelocity, Math.min(maxSegmentVelocity, newSegmentVelY));

            // Reduce ball velocity (gentler reduction)
            ball.velocityX *= 0.9; // Gentler reduction (changed from (1 - transferFactor))
            ball.velocityY *= 0.9; // Gentler reduction (changed from (1 - transferFactor))

            // Add very small randomness (much smaller)
            segment.velocityX += (Math.random() - 0.5) * 0.2; // Much smaller randomness (changed from * 2)
            segment.velocityY += (Math.random() - 0.5) * 0.2; // Much smaller randomness (changed from * 2)

            console.log(`Ball hit rope segment! Ball speed: ${ballSpeed.toFixed(2)}, transfer: ${transferFactor}`);
          }
        }
      });
    });
  }

  updateConstraints() {
    // Apply distance constraints to keep segments connected
    this.segmentConnections.forEach((connection, index) => {
      const segment1 = connection.segment1 as any;
      const segment2 = connection.segment2 as any;

      const dx = segment2.x - segment1.x;
      const dy = segment2.y - segment1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const targetDistance = connection.distance;
        const difference = (distance - targetDistance) / distance;

        // Very gentle constraint correction
        const correctionStrength = 0.1; // Very gentle correction strength

        const moveX = dx * difference * correctionStrength;
        const moveY = dy * difference * correctionStrength;

        // Don't move the anchor (first segment)
        if (!segment1.isAnchor) {
          segment1.x -= moveX;
          segment1.y -= moveY;
        }

        // Move the second segment
        segment2.x += moveX;
        segment2.y += moveY;

        // Debug: Log constraint updates less frequently
        // if (this.frameCount % 60 === 0) {
        //   console.log(`Constraint ${index}: distance=${distance.toFixed(1)}, target=${targetDistance}, difference=${difference.toFixed(3)}, move=(${moveX.toFixed(2)}, ${moveY.toFixed(2)})`);
        // }
      }
    });
  }
} 
