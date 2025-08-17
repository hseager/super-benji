import {
  PLAYER_ATTACK_SPEED,
  PLAYER_BULLET_DAMAGE,
  PLAYER_BULLET_PALETTES,
  PLAYER_BULLET_SPEED,
  PLAYER_HEALTH_GLOW_COLOURS,
  PLAYER_MAX_LIFE,
  PLAYER_MOVEMENT_X_SPEED,
  PLAYER_MOVEMENT_Y_SPEED,
} from "@/core/config";
import { logicalHeight, logicalWidth } from "@/core/controllers/DrawController";
import { Shooter } from "./shooter";
import { BulletPool } from "./bulletPool";
import { getInterpolatedColor } from "../utilities";
import { GameController } from "../controllers/GameController";

export class Player extends Shooter {
  // Movement
  moveTolerance = 2; // Pixels to consider "close enough" to target

  // GFX
  sprite: HTMLImageElement;
  shootingXOffset = -2; // Offset for shooting position
  boosterSize = 6; // Size of the booster flame
  boosterYOffset = -2; // Offset for booster flame position
  bulletColor: keyof typeof PLAYER_BULLET_PALETTES = "blue";

  // Glow
  glowColor: string = "#00bfff7c"; // Default glow color
  glowAmount: number = 10; // Default glow radius

  // Stats
  movementXSpeed: number = PLAYER_MOVEMENT_X_SPEED;
  movementYSpeed: number = PLAYER_MOVEMENT_Y_SPEED;
  maxLife = PLAYER_MAX_LIFE;
  life = PLAYER_MAX_LIFE;
  attackSpeed = PLAYER_ATTACK_SPEED;
  damage = PLAYER_BULLET_DAMAGE;
  bulletSpeed = PLAYER_BULLET_SPEED;
  evasion = 0;
  regen = 0;
  private regenTimer = 0;

  constructor(
    gameController: GameController,
    sprite: HTMLImageElement,
    bulletPool: BulletPool
  ) {
    super(
      gameController,
      sprite,
      bulletPool,
      logicalWidth / 2,
      logicalHeight - sprite.height,
      sprite.width,
      sprite.height
    );
    this.sprite = sprite;
  }

  update(delta: number, targetX: number, targetY: number) {
    if (this.isExploding) {
      this.addExplosionParts(delta);
    } else {
      this.regenTick(delta);

      // Movement towards cursor
      const dx = targetX - this.centerX();
      const dy = targetY - this.centerY();
      const distance = Math.hypot(dx, dy);

      if (distance > this.moveTolerance) {
        // Normalize and move toward mouse at fixed speed
        this.x += (dx / distance) * this.movementXSpeed * delta;
        this.y += (dy / distance) * this.movementYSpeed * delta;
      }

      this.velocity = {
        x: this.x - this.lastPosition.x,
        y: this.y - this.lastPosition.y,
      };

      this.lastPosition = {
        x: this.x,
        y: this.y,
      };

      this.glowColor = getInterpolatedColor(
        this.life / this.maxLife,
        PLAYER_HEALTH_GLOW_COLOURS
      );

      this.updateShooting(delta);
      this.shoot(this.damage, this.bulletSpeed, this.bulletColor);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isExploding) {
      this.drawExplosionParts(ctx);
    } else {
      ctx.save();

      // Glow
      ctx.shadowColor = this.glowColor;
      ctx.shadowBlur = this.glowAmount;

      this.drawBoosters(ctx);
      this.manageTilt(ctx);

      ctx.restore();
    }
  }

  regenTick(delta: number) {
    if (this.regen > 0 && this.life < this.maxLife) {
      this.regenTimer += delta;

      // Trigger once per second
      if (this.regenTimer >= 5) {
        this.life += this.regen;

        if (this.life > this.maxLife) {
          this.life = this.maxLife;
        }

        this.regenTimer = 0; // reset timer
      }
    }
  }

  private drawBoosters(ctx: CanvasRenderingContext2D) {
    const boosterX = this.centerX();
    const boosterY = this.y + this.height + this.boosterYOffset;

    // Create gradient (blue → white → orange)
    const gradient = ctx.createLinearGradient(
      boosterX,
      boosterY,
      boosterX,
      boosterY + 20
    );
    gradient.addColorStop(0, "rgba(0, 180, 255, 0.9)"); // blue core
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)"); // white mid
    gradient.addColorStop(1, "rgba(255, 140, 0, 0)"); // orange tail fade

    // Flicker by randomizing length
    const flicker = this.boosterSize + Math.random() * 3;

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(boosterX - 1, boosterY); // left booster edge
    ctx.lineTo(boosterX, boosterY + flicker); // center flame tip
    ctx.lineTo(boosterX + 1, boosterY); // right booster edge
    ctx.closePath();
    ctx.fill();
  }

  takeDamage(damage: number) {
    this.life -= damage;
    if (this.life <= 0) {
      this.explode(40);
    }
  }
}
