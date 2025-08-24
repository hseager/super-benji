import { Enemy } from "@/core/model/enemy";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { Background } from "@/core/model/background";
import {
  BACKGROUND_SPEED_INCREASE,
  BASE_TRANSITION_ANIMATION_TIME,
  BOSS_ATTACK_SPEED,
  BOSS_BULLET_DAMAGE,
  BOSS_BULLET_SPEED,
  BOSS_MAX_LIFE,
  ENEMY_ATTACK_SPEED,
  ENEMY_BULLET_DAMAGE,
  ENEMY_BULLET_SPEED,
  ENEMY_MAX_LIFE,
  ENEMY_START_POSITION_Y,
  LEVEL_NAMES,
  UBER_BOSS_STAT_MULTIPLIER,
} from "../config";
import { screenTransitions } from "./ScreenTransitionController";
import { EnemyConfig } from "../types";
import { Boss } from "../model/boss";

export class LevelController {
  currentLevel: number = 0;
  currentWave: number = 0;
  wavesPerLevel: number = 1; // waves per level
  private baseEnemyCount = 1;
  private textDisplayTimer = 0;
  private gameManager: GameController;
  private enemyYSpawnOffset = 100;
  private enemyTypes: EnemyConfig[];
  bossSpawned = false;
  rifts: { x: number; y: number; spawnTime: number }[] = [];
  gameTime: number = 0;

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
        bulletDamage: ENEMY_BULLET_DAMAGE,
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
        config.bulletSpeed * (1 + this.currentLevel * 0.03);
      const scaledBulletDamage =
        config.bulletDamage * (1 + this.currentLevel * 0.02);
      const scaledHealth = ENEMY_MAX_LIFE * (1 + this.currentLevel * 0.05);

      const x = Math.random() * (drawEngine.canvasWidth - config.sprite.width);
      const y = ENEMY_START_POSITION_Y - Math.random() * this.enemyYSpawnOffset;

      this.gameManager.addEnemy(
        new Enemy(
          this.gameManager,
          config.sprite,
          this.gameManager.enemyBulletPool,
          scaledHealth,
          scaledBulletDamage,
          ENEMY_ATTACK_SPEED,
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
    this.gameManager.background = new Background(
      this.gameManager.background.backgroundYSpeed * BACKGROUND_SPEED_INCREASE,
      this.currentLevel
    );
    this.textDisplayTimer = 4;
    this.gameManager.enemies = []; // Clear previous enemies

    // Increase waves
    if (this.currentLevel % 6 === 0) {
      this.wavesPerLevel++;
    }

    const firstBossLevel = 15;
    const repeatInterval = 6;

    if (
      this.currentLevel >= firstBossLevel &&
      (this.currentLevel - firstBossLevel) % repeatInterval === 0
    ) {
      const bossNumber =
        Math.floor((this.currentLevel - firstBossLevel) / repeatInterval) + 1;

      const scaledLife =
        BOSS_MAX_LIFE * Math.pow(UBER_BOSS_STAT_MULTIPLIER, bossNumber);
      const scaledDamage =
        BOSS_BULLET_DAMAGE * Math.pow(UBER_BOSS_STAT_MULTIPLIER, bossNumber);
      const scaledAttackSpeed =
        BOSS_ATTACK_SPEED * Math.pow(UBER_BOSS_STAT_MULTIPLIER, bossNumber);
      const scaledBulletSpeed =
        BOSS_BULLET_SPEED * Math.pow(UBER_BOSS_STAT_MULTIPLIER, bossNumber);

      this.spawnBoss(
        scaledLife,
        scaledDamage,
        scaledAttackSpeed,
        scaledBulletSpeed
      );
    } else {
      this.spawnNextWave();
    }
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

  spawnBoss(
    health: number,
    damage: number,
    attackSpeed: number,
    bulletSpeed: number
  ) {
    this.bossSpawned = true;
    this.gameManager.addEnemy(
      new Boss(
        this.gameManager,
        this.gameManager.spriteManager.jackalSprite,
        this.gameManager.enemyBulletPool,
        health,
        damage,
        attackSpeed,
        bulletSpeed,
        drawEngine.canvasWidth / 2 -
          this.gameManager.spriteManager.jackalSprite.width / 2,
        20,
        "none",
        "boss"
      )
    );
  }

  spawnRift() {
    const x = Math.random() * drawEngine.canvasWidth;
    const y = Math.random() * drawEngine.canvasHeight * 0.4; // keep it near top/middle
    this.rifts.push({ x, y, spawnTime: this.gameTime });
  }

  drawRift(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    const numArms = 5; // spiral arms
    const armLength = 30; // how far out the galaxy goes
    const particles = 15; // number of dots per arm

    ctx.save();
    ctx.translate(x, y);

    for (let arm = 0; arm < numArms; arm++) {
      const angleOffset = (arm / numArms) * Math.PI * 2;

      for (let i = 0; i < particles; i++) {
        const t = i / particles;
        const radius = t * armLength;

        // spiral angle
        const angle = angleOffset + t * 2.5 + time * 0.75;

        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;

        ctx.fillStyle = `rgba(150, 100, 255, ${1 - t})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  showBossHealth() {
    const boss = this.gameManager.enemies[0];
    if (!boss) return;

    const ctx = drawEngine.context;

    const barWidth = drawEngine.canvasWidth; // total width of the bar
    const barHeight = 10; // height of the bar
    const x = (ctx.canvas.width - barWidth) / 2; // center at top
    const y = 5;

    const healthRatio = boss.life / boss.maxLife;
    const currentWidth = barWidth * healthRatio;

    // background (gray)
    ctx.fillStyle = "#444";
    ctx.fillRect(x, y, barWidth, barHeight);

    // health (red)
    ctx.fillStyle = "#e33";
    ctx.fillRect(x, y, currentWidth, barHeight);

    // outline
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  checkRifts() {
    const boss = this.gameManager.enemies[0];
    if (!boss) return;

    if (boss.life <= boss.maxLife * 0.75 && this.rifts.length <= 0) {
      this.spawnRift();
    }

    if (boss.life <= boss.maxLife * 0.35 && this.rifts.length <= 1) {
      this.spawnRift();
    }

    for (const rift of this.rifts) {
      if (Math.random() < 0.02) {
        // 2% chance each frame
        this.shootFromRift(rift, ENEMY_BULLET_DAMAGE, ENEMY_BULLET_SPEED * 1.2);
      }
    }
  }

  shootFromRift(rift: { x: number; y: number }, damage: number, speed: number) {
    const bullet = this.gameManager.enemyBulletPool.get();
    if (!bullet) return;

    // random direction (unit vector)
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = 1;

    bullet.damage = damage;
    bullet.speed = speed;

    // spawn at rift center
    bullet.fire(rift.x, rift.y, dx, dy);

    // optional: make rift bullets a different color
    bullet.sprite = this.gameManager.spriteManager.getBulletSprite("purple");
  }

  handleBossDown() {
    this.bossSpawned = false;
    this.rifts = [];
    if (!screenTransitions.active) {
      screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
        this.gameManager.upgradeScreen.start();
        screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
      });
    }
  }

  /** Called every frame */
  update(delta: number) {
    this.gameTime += delta;

    const noEnemiesLeft = this.gameManager.enemies.length === 0;
    const noScreensActive =
      !this.gameManager.upgradeScreen.isActive &&
      !this.gameManager.storyController.isActive;

    if (this.bossSpawned) {
      this.checkRifts();
    }

    if (this.bossSpawned && noEnemiesLeft) {
      this.handleBossDown();
    }

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

  draw() {
    if (this.bossSpawned) {
      this.showBossHealth();
    }

    for (const rift of this.rifts) {
      this.drawRift(
        drawEngine.context,
        rift.x,
        rift.y,
        this.gameTime - rift.spawnTime
      );
    }

    /** Draw level/zone title during fade-in */
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
