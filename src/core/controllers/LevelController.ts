import { Enemy } from "@/core/model/enemy";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { Background } from "@/core/model/background";
import { screenTransitions } from "./ScreenTransitionController";
import { BASE_ANIMATION_TIME } from "../config";

export class LevelController {
  private baseEnemyCount = 3;
  private currentLevel: number = 1;
  private displayTimer = 0;
  private gameManager: GameController;
  private enemyYSpawnOffset = 100;

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
  }

  startLevel(level: number) {
    this.currentLevel = level;
    this.displayTimer = 2;
    this.gameManager.enemies = []; // Clear previous enemies
    this.spawnEnemies();
  }

  nextLevel() {
    this.startLevel(this.currentLevel + 1);
    this.gameManager.background = new Background(); // Change the BG colour each level
  }

  update(delta: number) {
    if (
      this.gameManager.enemies.length === 0 &&
      !this.gameManager.upgradeScreen.isActive &&
      !this.gameManager.upgradeScreen.isFinished
    ) {
      if (!screenTransitions.isFading) {
        screenTransitions.startFade("fade-out", BASE_ANIMATION_TIME, () => {
          this.gameManager.upgradeScreen.start();
          screenTransitions.startFade("fade-in");
        });
      }
    }

    if (this.gameManager.upgradeScreen.isFinished) {
      this.gameManager.upgradeScreen.isFinished = false;
      this.nextLevel();
    }

    if (this.displayTimer > 0) {
      this.displayTimer -= delta;
    }
  }

  draw() {
    if (this.displayTimer > 0) {
      // Calculate opacity based on displayTimer (fade out over 2 seconds)
      const maxDisplayTime = BASE_ANIMATION_TIME;
      const opacity = Math.min(this.displayTimer / maxDisplayTime, 1);

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

    for (let i = 0; i < enemyCount; i++) {
      const x =
        Math.random() *
        (drawEngine.canvasWidth -
          this.gameManager.spriteManager.enemySprite.width);
      const y = Math.random() * this.enemyYSpawnOffset; // staggered spawn above screen
      this.gameManager.addEnemy(
        new Enemy(
          this.gameManager.spriteManager.enemySprite,
          this.gameManager.enemyBulletPool,
          x,
          y
        )
      );
    }
  }
}
