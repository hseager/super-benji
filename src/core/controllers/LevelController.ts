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
import { EnemyConfig } from "../types";

export class LevelController {
  currentLevel: number = 0;
  currentWave: number = 0;
  wavesPerLevel: number = 2; // waves per level
  private baseEnemyCount = 1;
  private textDisplayTimer = 0;
  private gameManager: GameController;
  private enemyYSpawnOffset = 100;
  private enemyTypes: EnemyConfig[];

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;

    this.enemyTypes = [
      {
        sprite: this.gameManager.spriteManager.basicEnemySprite,
        movePattern: "straight",
        shootPattern: "single",
        bulletSpeed: ENEMY_BULLET_SPEED,
        bulletDamage: ENEMY_BULLET_DAMAGE,
      },
      {
        sprite: this.gameManager.spriteManager.moderateEnemySprite,
        movePattern: "sine",
        shootPattern: "burst",
        bulletSpeed: ENEMY_BULLET_SPEED * 1.2,
        bulletDamage: ENEMY_BULLET_DAMAGE * 1.1,
      },
      {
        sprite: this.gameManager.spriteManager.advancedEnemySprite,
        movePattern: "zigzag",
        shootPattern: "spread",
        bulletSpeed: ENEMY_BULLET_SPEED * 1.5,
        bulletDamage: ENEMY_BULLET_DAMAGE * 1.2,
      },
    ];
  }

  /** Spawn a single wave */
  spawnWave(waveNumber: number) {
    const baseCount = this.baseEnemyCount + (this.currentLevel - 1) * 2;
    const enemyCount = baseCount + waveNumber * 2; // wave scaling

    for (let i = 0; i < enemyCount; i++) {
      const config =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

      // scale difficulty with level
      const scaledBulletSpeed =
        config.bulletSpeed * (1 + this.currentLevel * 0.05);
      const scaledBulletDamage =
        config.bulletDamage * (1 + this.currentLevel * 0.03);

      const x = Math.random() * (drawEngine.canvasWidth - config.sprite.width);
      const y = ENEMY_START_POSITION_Y - Math.random() * this.enemyYSpawnOffset;

      this.gameManager.addEnemy(
        new Enemy(
          this.gameManager,
          config.sprite,
          this.gameManager.enemyBulletPool,
          scaledBulletDamage,
          scaledBulletSpeed,
          x,
          y,
          config.movePattern,
          config.shootPattern
        )
      );
    }
  }

  /** Start a new level */
  startLevel() {
    this.currentWave = 0;
    this.gameManager.background = new Background();
    this.textDisplayTimer = 3;
    this.gameManager.enemies = []; // Clear previous enemies
    this.spawnNextWave();
  }

  /** Spawn the next wave or end the level */
  spawnNextWave() {
    if (this.currentWave < this.wavesPerLevel) {
      this.currentWave++;
      this.spawnWave(this.currentWave);
    } else {
      // no more waves -> go to upgrade screen
      screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
        this.gameManager.upgradeScreen.start();
        screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
      });
    }
  }

  /** Go to the next level */
  nextLevel() {
    this.currentLevel++;
    this.gameManager.storyController.progressStory(this.currentLevel);

    if (!this.gameManager.storyController.isActive) {
      this.startLevel();
    }
  }

  /** Called every frame */
  update(delta: number) {
    const noEnemiesLeft = this.gameManager.enemies.length === 0;
    const noScreensActive =
      !this.gameManager.upgradeScreen.isActive &&
      !this.gameManager.storyController.isActive;

    if (noEnemiesLeft && noScreensActive) {
      if (this.currentWave < this.wavesPerLevel) {
        // More waves remain → spawn next one
        this.spawnNextWave();
      } else {
        if (!screenTransitions.active) {
          screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
            this.gameManager.upgradeScreen.start();
            screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
          });
        }
      }
    }

    if (this.textDisplayTimer > 0) {
      this.textDisplayTimer -= delta;
    }
  }

  /** Draw level/zone title during fade-in */
  draw() {
    if (this.textDisplayTimer > 0) {
      const maxDisplayTime = BASE_TRANSITION_ANIMATION_TIME;
      const opacity = Math.min(this.textDisplayTimer / maxDisplayTime, 1);

      drawEngine.context.save();
      drawEngine.context.globalAlpha = opacity;

      const { area, zone } = this.getLevelName(this.currentLevel);

      drawEngine.drawTitle(
        area,
        24,
        drawEngine.canvasWidth / 2,
        drawEngine.canvasHeight * 0.2
      );
      drawEngine.drawTitle(
        `Zone ${zone}`,
        32,
        drawEngine.canvasWidth / 2,
        drawEngine.canvasHeight * 0.275
      );

      drawEngine.context.restore();
    }
  }

  /** Map level number to area/zone name */
  getLevelName(level: number) {
    const zonesPerArea = 5;
    const lastAreaIndex = LEVEL_NAMES.length - 1;
    const areaIndex = Math.floor((level - 1) / zonesPerArea);

    if (areaIndex < lastAreaIndex) {
      const zoneNumber = ((level - 1) % zonesPerArea) + 1;
      return {
        area: LEVEL_NAMES[areaIndex],
        zone: zoneNumber,
      };
    } else {
      const zoneNumber = level - lastAreaIndex * zonesPerArea;
      return {
        area: LEVEL_NAMES[lastAreaIndex],
        zone: zoneNumber,
      };
    }
  }
}
