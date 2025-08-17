import { Enemy } from "@/core/model/enemy";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { Background } from "@/core/model/background";
import {
  BASE_TRANSITION_ANIMATION_TIME,
  ENEMY_BULLET_DAMAGE,
  ENEMY_BULLET_SPEED,
  ENEMY_START_POSITION_Y,
  LEVEL_NAMES,
} from "../config";
import { screenTransitions } from "./ScreenTransitionController";

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
    this.textDisplayTimer = 3;
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
      !this.gameManager.upgradeScreen.isActive
    ) {
      if (!screenTransitions.isFading) {
        screenTransitions.startFade(
          "fade-out",
          BASE_TRANSITION_ANIMATION_TIME,
          () => {
            this.gameManager.upgradeScreen.start();
            screenTransitions.startFade("fade-in");
          }
        );
      }
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

      const { area, zone } = this.getLevelName(this.currentLevel);

      drawEngine.drawTitle(area, 12, drawEngine.canvasWidth / 2, 40);
      drawEngine.drawTitle(`Zone ${zone}`, 16, drawEngine.canvasWidth / 2, 65);

      drawEngine.context.restore();
    }
  }

  getLevelName(level: number) {
    const zonesPerArea = 5;
    const lastAreaIndex = LEVEL_NAMES.length - 1;
    const areaIndex = Math.floor((level - 1) / zonesPerArea);

    if (areaIndex < lastAreaIndex) {
      // Normal areas (with 1–5 zones)
      const zoneNumber = ((level - 1) % zonesPerArea) + 1;
      return {
        area: LEVEL_NAMES[areaIndex],
        zone: zoneNumber,
      };
    } else {
      // Outer Wilds (infinite zones)
      const zoneNumber = level - lastAreaIndex * zonesPerArea;
      return {
        area: LEVEL_NAMES[lastAreaIndex],
        zone: zoneNumber,
      };
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
          this.gameManager,
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
