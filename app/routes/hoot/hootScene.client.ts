import Phaser from "phaser";
import type { HootGameContext } from "./context.client";

export class HootGameScene extends Phaser.Scene {
  context: HootGameContext;
  private player!: Phaser.GameObjects.Container;
  private playerHealth: number = 100;
  private bullets: Phaser.GameObjects.Shape[] = [];
  private enemies: Phaser.GameObjects.Rectangle[] = [];
  private enemyHealths: Map<Phaser.GameObjects.Rectangle, number> = new Map();
  private lastShootTime: number = 0;
  private shootCooldown: number = 500; // 500ms = 0.5 seconds
  private gameOver: boolean = false;
  private healthText!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private stageText!: Phaser.GameObjects.Text;
  private congratulationsText!: Phaser.GameObjects.Text;
  private playerDirection: number = 0; // 0 = right, 1 = down, 2 = left, 3 = up
  private keys: { [key: string]: boolean } = {}; // Track key states
  private enemySpeed: number = 2; // Speed at which enemies advance toward player (doubled from 1)
  private explosionRadius: number = 50; // Proximity for explosion
  private explosionDamage: number = 50; // Damage from explosion
  private currentStage: number = 1;
  private stageConfigs = [
    { enemies: 1, balls: 1 }, // Stage 1
    { enemies: 4, balls: 2 }, // Stage 2
    { enemies: 14, balls: 4 }, // Stage 3 (4 balls size 60)
  ];
  private isTransitioning: boolean = false; // Flag to prevent premature stage completion
  private gameState: 'menu' | 'playing' | 'gameOver' = 'menu'; // Game state management
  private menuTitle!: Phaser.GameObjects.Text;
  private menuSubtitle!: Phaser.GameObjects.Text;
  private isStageFrozen: boolean = false; // Freeze state for stage transitions
  private freezeCountdownText!: Phaser.GameObjects.Text;
  private freezeTimer: number = 0; // Timer for freeze countdown
  private stageStartTime: number = 0; // Track when stage started
  private stageTimeText!: Phaser.GameObjects.Text;
  private deathMessages = [
    "I guess your school teachers were right - you are a failure.",
    "Don't quit your day job - maybe this isn't for you.",
    "Now I know AI will definitely take over the world. You poor excuse for a human."
  ];
  private playerSize: number = 15; // Player size (width and height)

  constructor(context: HootGameContext) {
    super("hoot-game-scene");
    this.context = context;
  }

  preload() {
    // Load sound assets
    this.load.audio('shoot', '/hoot-sounds/Shoot.wav');
    this.load.audio('shotHitBall', '/hoot-sounds/Shot Hit Ball.wav');
    this.load.audio('shotHitEnemy', '/hoot-sounds/Shot Hit Enemy.wav');
    this.load.audio('enemyDie', '/hoot-sounds/Enemy die.wav');
    this.load.audio('ballHitWall', '/hoot-sounds/Ball Hit Wall.wav');
    this.load.audio('ballHitBall1', '/hoot-sounds/Ball Hit Ball1.wav');
    this.load.audio('ballHitBall2', '/hoot-sounds/Ball Hit Ball2.wav');
    this.load.audio('ballHitBall3', '/hoot-sounds/Ball Hit Ball3.wav');
  }

  create() {
    if (!this.context) {
      console.error("Context is undefined!");
      return;
    }
    this.context.scene = this;

    // Create border
    this.createBorder();

    // Create UI
    this.createUI();

    // Setup input
    this.setupInput();

    // Show menu initially
    this.showMenu();
  }

  createBorder() {
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xffffff);
    graphics.strokeRect(10, 10, this.cameras.main.width - 20, this.cameras.main.height - 20);
  }

  createPlayer() {
    // Create a container for the complex player object
    this.player = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);

    // Array to hold all player shapes
    const playerShapes: Phaser.GameObjects.Shape[] = [];

    // Create the main black rectangle body
    const body = this.add.rectangle(0, 0, this.playerSize, this.playerSize, 0x000000); // Black rectangle
    playerShapes.push(body);

    const eyeSize = 4;
    const cornerOffset = (this.playerSize / 2) - 2;
    const leftEye = this.add.circle(-cornerOffset, -cornerOffset, eyeSize, 0xffffff);
    const rightEye = this.add.circle(cornerOffset, -cornerOffset, eyeSize, 0xffffff);
    playerShapes.push(leftEye);
    playerShapes.push(rightEye);

    const pupilSize = 1;
    const leftPupil = this.add.circle(-cornerOffset, -cornerOffset, pupilSize, 0x000000);
    const rightPupil = this.add.circle(cornerOffset, -cornerOffset, pupilSize, 0x000000);
    playerShapes.push(leftPupil);
    playerShapes.push(rightPupil);

    this.player.add(playerShapes);
  }

  createBalls() {
    const currentConfig = this.stageConfigs[this.currentStage - 1];
    const ballCount = currentConfig.balls;

    // Clear existing balls
    this.context.balls.forEach(ball => ball.destroy());
    this.context.balls = [];

    // Create balls based on stage configuration
    for (let i = 0; i < ballCount; i++) {
      let ballRadius = 36; // Default radius for stages 1 and 2

      // Stage 3 has all balls the same size
      if (this.currentStage === 3) {
        ballRadius = 60; // All 4 balls are size 60
      }

      // Position balls around the player for stage 3
      let ballX, ballY;
      if (this.currentStage === 3) {
        // For stage 3, position balls around the player
        const playerX = this.cameras.main.width / 2;
        const playerY = this.cameras.main.height / 2;

        switch (i) {
          case 0: // Ball above player
            ballX = playerX;
            ballY = playerY - 90;
            break;
          case 1: // Ball below player
            ballX = playerX;
            ballY = playerY + 90;
            break;
          case 2: // Ball to the right of player
            ballX = playerX + 90;
            ballY = playerY;
            break;
          case 3: // Ball to the left of player
            ballX = playerX - 90;
            ballY = playerY;
            break;
          default:
            ballX = playerX;
            ballY = playerY;
        }
      } else {
        // For other stages, use random positioning
        ballX = 100 + Math.random() * (this.cameras.main.width - 200);
        ballY = 50 + Math.random() * (this.cameras.main.height - 100);
      }

      const ball = this.add.circle(
        ballX,
        ballY,
        ballRadius,
        0xff0000 // Red color
      );

      // Add custom physics properties with specific directions for stage 3
      let velocityX, velocityY;
      if (this.currentStage === 3) {
        // Stage 3 has specific slow directions for each ball
        const slowSpeed = 1; // Slow speed
        switch (i) {
          case 0: // Ball above player - move upward
            velocityX = 0;
            velocityY = -slowSpeed;
            break;
          case 1: // Ball below player - move downward
            velocityX = 0;
            velocityY = slowSpeed;
            break;
          case 2: // Ball to the right of player - move rightward
            velocityX = slowSpeed;
            velocityY = 0;
            break;
          case 3: // Ball to the left of player - move leftward
            velocityX = -slowSpeed;
            velocityY = 0;
            break;
          default:
            velocityX = (Math.random() - 0.5) * 4;
            velocityY = (Math.random() - 0.5) * 4;
        }
      } else {
        // Random velocity for other stages
        velocityX = (Math.random() - 0.5) * 4;
        velocityY = (Math.random() - 0.5) * 4;
      }

      (ball as any).velocityX = velocityX;
      (ball as any).velocityY = velocityY;
      (ball as any).mass = 2;
      (ball as any).radius = ballRadius; // Updated radius to match visual size

      this.context.balls.push(ball);
    }
  }

  createEnemies() {
    const currentConfig = this.stageConfigs[this.currentStage - 1];
    const enemyCount = currentConfig.enemies;

    // Clear existing enemies
    this.enemies.forEach(enemy => enemy.destroy());
    this.enemies = [];
    this.enemyHealths.clear();

    // Create enemies based on stage configuration
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    const enemyPositions = [
      { x: 100, y: 100 },
      { x: screenWidth - 100, y: 100 },
      { x: 100, y: screenHeight - 100 },
      { x: screenWidth - 100, y: screenHeight - 100 },
      { x: screenWidth / 2, y: 50 },
      { x: screenWidth / 2, y: screenHeight - 50 }
    ];

    // Generate additional positions for stage 3 (30 enemies)
    if (this.currentStage === 3) {
      // Add more enemy positions around the screen, positioned far from center
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * 2 * Math.PI;
        const radius = 300 + Math.random() * 200; // Much larger radius (300-500 instead of 150-250)
        const x = screenWidth / 2 + Math.cos(angle) * radius;
        const y = screenHeight / 2 + Math.sin(angle) * radius;
        enemyPositions.push({ x, y });
      }
    }

    // Use only the positions needed for this stage
    for (let i = 0; i < enemyCount; i++) {
      let pos: { x: number; y: number };
      if (i < enemyPositions.length) {
        pos = enemyPositions[i];
      } else {
        // Generate random positions for additional enemies, far from center for stage 3
        if (this.currentStage === 3) {
          // Place enemies in corners or edges, far from center
          const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
          switch (side) {
            case 0: // top
              pos = { x: Math.random() * screenWidth, y: 50 + Math.random() * 100 };
              break;
            case 1: // right
              pos = { x: screenWidth - 150 - Math.random() * 100, y: Math.random() * screenHeight };
              break;
            case 2: // bottom
              pos = { x: Math.random() * screenWidth, y: screenHeight - 150 - Math.random() * 100 };
              break;
            case 3: // left
              pos = { x: 50 + Math.random() * 100, y: Math.random() * screenHeight };
              break;
            default:
              pos = { x: 50 + Math.random() * (screenWidth - 100), y: 50 + Math.random() * (screenHeight - 100) };
          }
        } else {
          // Normal random positioning for other stages
          pos = {
            x: 50 + Math.random() * (screenWidth - 100),
            y: 50 + Math.random() * (screenHeight - 100)
          };
        }
      }

      const enemy = this.add.rectangle(pos.x, pos.y, 20, 20, 0x00ff00); // Green rectangle
      this.enemies.push(enemy);
      this.enemyHealths.set(enemy, 100);
    }
  }

  createUI() {
    this.healthText = this.add.text(20, 20, `Health: ${this.playerHealth}`, {
      fontSize: '24px',
      color: '#ffffff'
    });
    this.healthText.setVisible(false);

    this.stageText = this.add.text(20, 50, `Stage: ${this.currentStage}`, {
      fontSize: '24px',
      color: '#ffffff'
    });
    this.stageText.setVisible(false);

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000'
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.setVisible(false);

    this.congratulationsText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'CONGRATULATIONS!', {
      fontSize: '36px',
      color: '#00ff00'
    });
    this.congratulationsText.setOrigin(0.5);
    this.congratulationsText.setVisible(false);

    this.stageTimeText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 20, '', {
      fontSize: '24px',
      color: '#ffff00'
    });
    this.stageTimeText.setOrigin(0.5);
    this.stageTimeText.setVisible(false);

    // Create menu UI
    this.menuTitle = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'LOOPLESS GAME', {
      fontSize: '48px',
      color: '#ffffff'
    });
    this.menuTitle.setOrigin(0.5);

    this.menuSubtitle = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Press SPACE to start', {
      fontSize: '24px',
      color: '#ffff00'
    });
    this.menuSubtitle.setOrigin(0.5);

    // Create freeze countdown text
    this.freezeCountdownText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, '3', {
      fontSize: '72px',
      color: '#ffff00'
    });
    this.freezeCountdownText.setOrigin(0.5);
    this.freezeCountdownText.setVisible(false);
  }

  setupInput() {
    // Track key states for continuous movement
    this.input.keyboard.on('keydown-LEFT', () => {
      this.keys['LEFT'] = true;
      this.playerDirection = 2; // Left
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
      this.keys['RIGHT'] = true;
      this.playerDirection = 0; // Right
    });

    this.input.keyboard.on('keydown-UP', () => {
      this.keys['UP'] = true;
      this.playerDirection = 3; // Up
    });

    this.input.keyboard.on('keydown-DOWN', () => {
      this.keys['DOWN'] = true;
      this.playerDirection = 1; // Down
    });

    // Key up events to stop movement
    this.input.keyboard.on('keyup-LEFT', () => {
      this.keys['LEFT'] = false;
    });

    this.input.keyboard.on('keyup-RIGHT', () => {
      this.keys['RIGHT'] = false;
    });

    this.input.keyboard.on('keyup-UP', () => {
      this.keys['UP'] = false;
    });

    this.input.keyboard.on('keyup-DOWN', () => {
      this.keys['DOWN'] = false;
    });

    // Space to shoot or start game
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.gameState === 'menu') {
        this.startGame();
      } else if (this.gameState === 'playing' && !this.gameOver && !this.isStageFrozen && this.player && this.time.now - this.lastShootTime > this.shootCooldown) {
        this.shoot();
        this.lastShootTime = this.time.now;
      }
    });
  }

  shoot() {
    if (!this.player) return;

    // Play shoot sound
    this.sound.play('shoot');

    // Create bullet at player position
    const bullet = this.add.circle(this.player.x, this.player.y, 2, 0xffff00); // Yellow circle

    // Calculate direction based on player direction
    let angle = 0;
    switch (this.playerDirection) {
      case 0: // Right
        angle = 0;
        break;
      case 1: // Down
        angle = Math.PI / 2;
        break;
      case 2: // Left
        angle = Math.PI;
        break;
      case 3: // Up
        angle = -Math.PI / 2;
        break;
    }

    // Fast bullet velocity
    const bulletSpeed = 20;
    (bullet as any).velocityX = Math.cos(angle) * bulletSpeed;
    (bullet as any).velocityY = Math.sin(angle) * bulletSpeed;
    (bullet as any).radius = 2;

    this.bullets.push(bullet);
  }

  update() {
    if (this.gameState !== 'playing') return;

    // Handle freeze period
    if (this.isStageFrozen) {
      this.updateFreezeCountdown();
      return;
    }

    this.updatePlayerMovement();
    this.updateBalls();
    this.updateBullets();
    this.updateEnemies(); // New method for enemy advancement
    this.checkBallCollisions();
    this.checkBulletCollisions();
    this.checkPlayerCollisions();
    this.checkEnemyProximity(); // New method for explosion mechanic
    this.checkStageCompletion(); // New method for stage progression
    this.updateUI();
  }

  updatePlayerMovement() {
    if (!this.player || this.isStageFrozen) return;

    // Handle continuous movement based on key states
    if (this.keys['LEFT']) {
      this.player.x = Math.max(20, this.player.x - 5);
      this.playerDirection = 2; // Left
    }

    if (this.keys['RIGHT']) {
      this.player.x = Math.min(this.cameras.main.width - 20, this.player.x + 5);
      this.playerDirection = 0; // Right
    }

    if (this.keys['UP']) {
      this.player.y = Math.max(20, this.player.y - 5);
      this.playerDirection = 3; // Up
    }

    if (this.keys['DOWN']) {
      this.player.y = Math.min(this.cameras.main.height - 20, this.player.y + 5);
      this.playerDirection = 1; // Down
    }
  }

  updateEnemies() {
    // Make enemies slowly advance toward the player
    this.enemies.forEach((enemy) => {
      if (!enemy || !enemy.active || !this.player) return;

      // Calculate direction to player
      const dx = this.player!.x - enemy.x;
      const dy = this.player!.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        // Normalize direction and move toward player
        const moveX = (dx / distance) * this.enemySpeed;
        const moveY = (dy / distance) * this.enemySpeed;

        if (enemy && enemy.active) {
          enemy.x += moveX;
          enemy.y += moveY;
        }
      }
    });
  }

  checkEnemyProximity() {
    // Check if any enemy is within explosion radius
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy || !enemy.active || !this.player) continue;

      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.explosionRadius) {
        // Enemy is within proximity - trigger explosion
        this.triggerExplosion(enemy);

        // Remove the enemy
        this.sound.play('enemyDie');
        enemy.destroy();
        this.enemies.splice(i, 1);
        this.enemyHealths.delete(enemy);
      }
    }
  }

  triggerExplosion(enemy: Phaser.GameObjects.Rectangle) {
    // Create explosion effect
    const explosion = this.add.circle(enemy.x, enemy.y, this.explosionRadius, 0xff0000, 0.3);

    // Reduce player health
    this.playerHealth -= this.explosionDamage;

    // Remove explosion effect after a short time
    this.time.delayedCall(200, () => {
      explosion.destroy();
    });

    // Check for game over
    if (this.playerHealth <= 0) {
      this.gameOver = true;
      this.gameState = 'gameOver';

      // Make game over text bigger
      this.gameOverText.setFontSize('96px');
      this.gameOverText.setVisible(true);

      // Show random death message
      const randomDeathMessage = this.deathMessages[Math.floor(Math.random() * this.deathMessages.length)];
      this.stageTimeText.setText(randomDeathMessage);
      this.stageTimeText.setVisible(true);

      // Return to menu after 3 seconds
      this.time.delayedCall(3000, () => {
        this.showMenu();
      });
    }
  }

  checkStageCompletion() {
    // Don't check for completion during stage transitions
    if (this.isTransitioning) return;

    // Check if all enemies are destroyed
    if (this.enemies.length === 0) {
      // Show congratulations message
      this.congratulationsText.setVisible(true);

      // Set transitioning flag to prevent multiple calls
      this.isTransitioning = true;

      // Wait 2 seconds then move to next stage
      this.time.delayedCall(2000, () => {
        this.nextStage();
      });
    }
  }

  showMenu() {
    this.gameState = 'menu';
    this.menuTitle.setVisible(true);
    this.menuSubtitle.setVisible(true);
    this.healthText.setVisible(false);
    this.stageText.setVisible(false);
    this.gameOverText.setVisible(false);
    this.gameOverText.setFontSize('48px'); // Reset to original size
    this.congratulationsText.setVisible(false);
    this.stageTimeText.setVisible(false);
  }

  startGame() {
    this.gameState = 'playing';
    this.gameOver = false;
    this.currentStage = 1;
    this.playerHealth = 100;

    // Hide menu
    this.menuTitle.setVisible(false);
    this.menuSubtitle.setVisible(false);

    // Show game UI
    this.healthText.setVisible(true);
    this.stageText.setVisible(true);

    // Clear existing game elements
    if (this.player) {
      this.player.destroy();
    }
    this.bullets.forEach(bullet => bullet.destroy());
    this.bullets = [];
    this.enemies.forEach(enemy => enemy.destroy());
    this.enemies = [];
    this.enemyHealths.clear();
    this.context.balls.forEach(ball => ball.destroy());
    this.context.balls = [];

    // Create game elements
    this.createPlayer();
    this.createBalls();
    this.createEnemies();

    // Reset transitioning flag
    this.isTransitioning = false;

    // Start tracking stage time
    this.stageStartTime = this.time.now;
  }

  nextStage() {
    // Calculate stage completion time
    const stageTime = Math.round((this.time.now - this.stageStartTime) / 1000);

    // Hide congratulations text
    this.congratulationsText.setVisible(false);
    this.stageTimeText.setVisible(false);

    // Check if there are more stages
    if (this.currentStage < this.stageConfigs.length) {
      // Show stage-specific completion message
      let completionMessage = '';
      switch (this.currentStage) {
        case 1:
          completionMessage = 'That was easy.';
          break;
        case 2:
          completionMessage = 'Level completed. But I\'m pretty sure you will die in the next level.';
          break;
        case 3:
          completionMessage = '"Congratulation" you made it to the end :)';
          break;
      }

      this.congratulationsText.setText(completionMessage);
      this.congratulationsText.setVisible(true);

      // Show time taken
      this.stageTimeText.setText(`And it took you just ${stageTime} seconds.`);
      this.stageTimeText.setVisible(true);

      // Wait 3 seconds then continue to next stage
      this.time.delayedCall(3000, () => {
        // Hide completion messages
        this.congratulationsText.setVisible(false);
        this.stageTimeText.setVisible(false);

        this.currentStage++;

        // Update stage text
        this.stageText.setText(`Stage: ${this.currentStage}`);

        // Reset player position to center of screen
        if (this.player) {
          this.player.x = this.cameras.main.width / 2;
          this.player.y = this.cameras.main.height / 2;
        }

        // Create new stage content
        this.createBalls();
        this.createEnemies();

        // Reset transitioning flag after creating new content
        this.isTransitioning = false;

        // Start tracking time for new stage
        this.stageStartTime = this.time.now;

        // Start freeze period for stages 2 and 3
        if (this.currentStage > 1) {
          this.startFreezePeriod();
        }
      });
    } else {
      // Game completed - show final congratulations
      this.congratulationsText.setText('"Congratulation" you made it to the end :)');
      this.congratulationsText.setVisible(true);

      // Show final time
      this.stageTimeText.setText(`And it took you just ${stageTime} seconds.`);
      this.stageTimeText.setVisible(true);

      this.gameOver = true;
      this.gameState = 'gameOver';

      // Return to menu after 3 seconds
      this.time.delayedCall(3000, () => {
        this.showMenu();
      });
    }
  }

  startFreezePeriod() {
    this.isStageFrozen = true;
    this.freezeTimer = 3; // 3 seconds
    this.freezeCountdownText.setVisible(true);
    this.freezeCountdownText.setText('3');
  }

  updateFreezeCountdown() {
    this.freezeTimer -= 1 / 60; // Assuming 60 FPS, decrement by 1/60th of a second

    if (this.freezeTimer <= 0) {
      // Freeze period ended
      this.isStageFrozen = false;
      this.freezeCountdownText.setVisible(false);
    } else {
      // Update countdown display
      const secondsLeft = Math.ceil(this.freezeTimer);
      this.freezeCountdownText.setText(secondsLeft.toString());
    }
  }

  updateBalls() {
    // Update ball physics
    this.context.balls.forEach((ball: any) => {
      // No friction - balls never stop
      ball.velocityX *= 1.0; // No friction
      ball.velocityY *= 1.0; // No friction

      // Update position
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      // Bounce off walls
      if (ball.x - ball.radius < 20) {
        ball.x = 20 + ball.radius;
        ball.velocityX *= -0.8;
        this.sound.play('ballHitWall');
      }
      if (ball.x + ball.radius > this.cameras.main.width - 20) {
        ball.x = this.cameras.main.width - 20 - ball.radius;
        ball.velocityX *= -0.8;
        this.sound.play('ballHitWall');
      }
      if (ball.y - ball.radius < 20) {
        ball.y = 20 + ball.radius;
        ball.velocityY *= -0.8;
        this.sound.play('ballHitWall');
      }
      if (ball.y + ball.radius > this.cameras.main.height - 20) {
        ball.y = this.cameras.main.height - 20 - ball.radius;
        ball.velocityY *= -0.8;
        this.sound.play('ballHitWall');
      }
    });
  }

  updateBullets() {
    // Update bullet positions and remove those off-screen
    this.bullets = this.bullets.filter(bullet => {
      (bullet as any).x += (bullet as any).velocityX;
      (bullet as any).y += (bullet as any).velocityY;

      // Remove bullets that leave the screen
      if ((bullet as any).x < 0 || (bullet as any).x > this.cameras.main.width ||
        (bullet as any).y < 0 || (bullet as any).y > this.cameras.main.height) {
        bullet.destroy();
        return false;
      }
      return true;
    });
  }

  checkBallCollisions() {
    // Check collisions between balls
    for (let i = 0; i < this.context.balls.length; i++) {
      for (let j = i + 1; j < this.context.balls.length; j++) {
        const ball1 = this.context.balls[i] as any;
        const ball2 = this.context.balls[j] as any;

        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = ball1.radius + ball2.radius;

        if (distance < minDistance) {
          // Play random ball hit ball sound
          this.playRandomBallHitBallSound();

          // Collision detected - bounce balls off each other
          const angle = Math.atan2(dy, dx);

          // Push balls apart
          const overlap = minDistance - distance;
          const pushX = Math.cos(angle) * overlap * 0.5;
          const pushY = Math.sin(angle) * overlap * 0.5;

          ball1.x -= pushX;
          ball1.y -= pushY;
          ball2.x += pushX;
          ball2.y += pushY;

          // Calculate collision response
          const normalX = dx / distance;
          const normalY = dy / distance;

          // Relative velocity
          const relativeVelX = ball2.velocityX - ball1.velocityX;
          const relativeVelY = ball2.velocityY - ball1.velocityY;

          // Velocity along normal
          const velocityAlongNormal = relativeVelX * normalX + relativeVelY * normalY;

          // Don't resolve if velocities are separating
          if (velocityAlongNormal > 0) return;

          // Calculate impulse
          const restitution = 0.8; // Restored to original value for no friction
          const impulse = -(1 + restitution) * velocityAlongNormal;
          const impulseX = impulse * normalX;
          const impulseY = impulse * normalY;

          // Apply impulse
          ball1.velocityX -= impulseX / ball1.mass;
          ball1.velocityY -= impulseY / ball1.mass;
          ball2.velocityX += impulseX / ball2.mass;
          ball2.velocityY += impulseY / ball2.mass;
        }
      }
    }

    // Check ball collisions with enemies
    for (let i = 0; i < this.context.balls.length; i++) {
      const ball = this.context.balls[i] as any;
      if (!ball || !ball.active) continue;

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (!enemy || !enemy.active) continue;

        const dx = ball.x - enemy.x;
        const dy = ball.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = ball.radius + 10; // Enemy radius is 10

        if (distance < minDistance) {
          // Ball hit enemy - destroy the enemy
          this.sound.play('enemyDie');
          enemy.destroy();
          this.enemies.splice(j, 1);
          this.enemyHealths.delete(enemy);
        }
      }
    }
  }

  checkBulletCollisions() {
    // Check bullet collisions with balls and enemies
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (!bullet || !bullet.active) continue; // Skip destroyed bullets

      let bulletDestroyed = false;

      // Check bullet vs ball collisions
      for (let j = 0; j < this.context.balls.length; j++) {
        const ball = this.context.balls[j] as any;
        if (!ball || !ball.active) continue; // Skip destroyed balls

        const dx = bullet.x - ball.x;
        const dy = bullet.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (bullet as any).radius + ball.radius;

        if (distance < minDistance) {
          // Play shot hit ball sound
          this.sound.play('shotHitBall');

          // Transfer bullet energy to ball
          const transferFactor = 0.5;

          ball.velocityX += (bullet as any).velocityX * transferFactor;
          ball.velocityY += (bullet as any).velocityY * transferFactor;

          // Destroy bullet
          bullet.destroy();
          this.bullets.splice(i, 1);
          bulletDestroyed = true;
          break; // Exit ball loop since bullet is destroyed
        }
      }

      // Check bullet vs enemy collisions (only if bullet still exists)
      if (!bulletDestroyed && bullet && bullet.active) {
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (!enemy || !enemy.active) continue;

          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (bullet as any).radius + 10; // Enemy radius is 10

          if (distance < minDistance) {
            // Play shot hit enemy sound
            this.sound.play('shotHitEnemy');

            // Reduce enemy health
            const currentHealth = this.enemyHealths.get(enemy) || 0;
            const newHealth = currentHealth - 10;

            if (newHealth <= 0) {
              // Play enemy die sound
              this.sound.play('enemyDie');

              // Destroy enemy
              enemy.destroy();
              this.enemies.splice(j, 1);
              this.enemyHealths.delete(enemy);
            } else {
              // Update enemy health
              this.enemyHealths.set(enemy, newHealth);
            }

            // Destroy bullet
            bullet.destroy();
            this.bullets.splice(i, 1);
            break; // Exit enemy loop since bullet is destroyed
          }
        }
      }
    }
  }

  checkPlayerCollisions() {
    // Check ball collisions with player
    this.context.balls.forEach((ball: any) => {
      const dx = ball.x - this.player.x;
      const dy = ball.y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = ball.radius + (this.playerSize / 2); // Player radius is half of player size

      if (distance < minDistance) {
        // Reduce player health
        this.playerHealth -= 10;

        // Push ball away from player
        const angle = Math.atan2(dy, dx);
        ball.x = this.player.x + Math.cos(angle) * minDistance;
        ball.y = this.player.y + Math.sin(angle) * minDistance;

        // Check for game over
        if (this.playerHealth <= 0) {
          this.gameOver = true;
          this.gameOverText.setVisible(true);
        }
      }
    });
  }

  playRandomBallHitBallSound() {
    const ballHitSounds = ['ballHitBall1', 'ballHitBall2', 'ballHitBall3'];
    const randomSound = ballHitSounds[Math.floor(Math.random() * ballHitSounds.length)];
    this.sound.play(randomSound);
  }

  updateUI() {
    this.healthText.setText(`Health: ${this.playerHealth}`);
  }
} 
