import { Enemy } from "@/core/model/enemy";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { Background } from "@/core/model/background";

export class LevelController {
  private baseEnemyCount = 50;
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
    if (this.gameManager.enemies.length === 0) {
      this.nextLevel();
    }

    if (this.displayTimer > 0) {
      this.displayTimer -= delta;
    }
  }

  draw() {
    if (this.displayTimer > 0) {
      drawEngine.drawTitle(
        `Level ${this.currentLevel}`,
        24,
        drawEngine.canvasWidth / 2,
        80
      );
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
          this.gameManager.enemyBulletPool,
          x,
          y,
          this.gameManager.spriteManager.enemySprite
        )
      );
    }
  }
}
