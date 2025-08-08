import { Enemy } from "@/model/enemy";
import { drawEngine } from "./draw-engine";
import { GameManager } from "./game-manager";
import { Background } from "@/model/background";

export class LevelManager {
  private baseEnemyCount = 5;
  private currentLevel: number = 1;
  private displayTimer = 0;
  private gameManager: GameManager;

  constructor(gameManager: GameManager) {
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
      const x = Math.random() * drawEngine.canvasWidth;
      const y = Math.random() * 50; // staggered spawn above screen
      this.gameManager.addEnemy(
        new Enemy(x, y, this.gameManager.spriteManager.enemySprite)
      );
    }
  }
}
