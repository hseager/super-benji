import { Enemy } from "@/core/model/enemy";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { Background } from "@/core/model/background";
import {
  BASE_TRANSITION_ANIMATION_TIME,
  ENEMY_BULLET_DAMAGE,
  ENEMY_BULLET_SPEED,
  ENEMY_START_POSITION_Y,
} from "../config";

export class LevelController {
  currentLevel: number = 1;
  private baseEnemyCount = 4;
  private textDisplayTimer = 0;
  private gameManager: GameController;
  private enemyYSpawnOffset = 100;

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
  }

  startLevel(level: number) {
    this.currentLevel = level;
    this.textDisplayTimer = 2;
    this.gameManager.enemies = []; // Clear previous enemies
    this.spawnEnemies();
  }

  nextLevel() {
    this.startLevel(this.currentLevel + 1);
    this.gameManager.background = new Background(); // Change the BG colour each level
  }

  // update(delta: number) {
  //   if (
  //     this.gameManager.enemies.length === 0 &&
  //     !this.gameManager.upgradeScreen.isActive &&
  //     !this.gameManager.upgradeScreen.isFinished
  //   ) {
  //     if (!screenTransitions.isFading) {
  //       screenTransitions.startFade(
  //         "fade-out",
  //         BASE_TRANSITION_ANIMATION_TIME,
  //         () => {
  //           this.gameManager.upgradeScreen.start();
  //           screenTransitions.startFade("fade-in");
  //         }
  //       );
  //     }
  //   }

  //   if (this.gameManager.upgradeScreen.isFinished) {
  //     this.gameManager.upgradeScreen.isFinished = false;
  //     this.nextLevel();
  //   }

  //   if (this.displayTimer > 0) {
  //     this.displayTimer -= delta;
  //   }
  // }

  update(delta: number) {
    if (this.gameManager.enemies.length === 0) {
      this.nextLevel();
    }

    if (this.textDisplayTimer > 0) {
      this.textDisplayTimer -= delta;
    }
  }

  draw() {
    if (this.textDisplayTimer > 0) {
      // Calculate opacity based on displayTimer (fade out over 2 seconds)
      const maxDisplayTime = BASE_TRANSITION_ANIMATION_TIME;
      const opacity = Math.min(this.textDisplayTimer / maxDisplayTime, 1);

      // Save the context and set globalAlpha for fade effect
      drawEngine.context.save();
      drawEngine.context.globalAlpha = opacity;

      drawEngine.drawTitle(
        `Level ${this.currentLevel}`,
        24,
        drawEngine.canvasWidth / 2,
        60
      );

      drawEngine.context.restore();
    }
  }

  spawnEnemies() {
    const enemyCount = this.baseEnemyCount + (this.currentLevel - 1) * 2;

    const enemySprites = [
      this.gameManager.spriteManager.basicEnemySprite,
      this.gameManager.spriteManager.moderateEnemySprite,
      this.gameManager.spriteManager.advancedEnemySprite,
    ];

    for (let i = 0; i < enemyCount; i++) {
      // Pick sprite at random
      const randomSprite =
        enemySprites[Math.floor(Math.random() * enemySprites.length)];
      const x =
        Math.random() *
        (drawEngine.canvasWidth -
          this.gameManager.spriteManager.moderateEnemySprite.width);
      const y = ENEMY_START_POSITION_Y - Math.random() * this.enemyYSpawnOffset; // staggered spawn above screen
      this.gameManager.addEnemy(
        new Enemy(
          randomSprite,
          this.gameManager.enemyBulletPool,
          ENEMY_BULLET_DAMAGE,
          ENEMY_BULLET_SPEED,
          x,
          y
        )
      );
    }
  }
}
