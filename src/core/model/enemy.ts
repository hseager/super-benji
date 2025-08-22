import { drawEngine } from "@/core/controllers/DrawController";
import { Shooter } from "./shooter";
import { BulletPool } from "./bulletPool";
import {
  ENEMY_ATTACK_SPEED,
  ENEMY_ATTACK_VARIANCE,
  ENEMY_MAX_LIFE,
  ENEMY_MOVEMENT_Y_SPEED,
  ENEMY_PROXIMITY_DAMAGE,
} from "../config";
import { GameController } from "../controllers/GameController";
import { MovePattern, ShootPattern } from "../types";

export class Enemy extends Shooter {
  // GFX
  glowSprite: HTMLCanvasElement;
  glowColor: string = "#ffb3007c";
  glowAmount: number = 12;

  // Stats
  maxLife = ENEMY_MAX_LIFE;
  life = ENEMY_MAX_LIFE;
  movementYSpeed: number = ENEMY_MOVEMENT_Y_SPEED;
  movementVilocityX: number = 0;
  proximityDamage: number = ENEMY_PROXIMITY_DAMAGE;
  attackSpeed: number = ENEMY_ATTACK_SPEED;
  shootDir = { x: 0, y: 1 };

  damage: number;
  bulletSpeed: number;

  private directionChangeTimer = 0;
  bulletColor: string = "red";
  movePattern: MovePattern;

  constructor(
    gameController: GameController,
    sprite: HTMLImageElement,
    bulletPool: BulletPool,
    damage: number,
    bulletSpeed: number,
    x: number,
    y: number,
    movePattern: MovePattern,
    shootPattern: ShootPattern
  ) {
    super(
      gameController,
      sprite,
      bulletPool,
      x,
      y,
      sprite.width,
      sprite.height
    );
    this.glowSprite = this.preloadGlowSprite();
    this.movementVilocityX = (Math.random() - 0.5) * 60;

    this.damage = damage;
    this.bulletSpeed = bulletSpeed;

    this.movePattern = movePattern;
    this.shootPattern = shootPattern;

    // Give each enemy attack speed variance
    this.attackSpeed =
      ENEMY_ATTACK_SPEED + (Math.random() * 2 - 1) * ENEMY_ATTACK_VARIANCE;
    this.attackCooldown = Math.random() * this.attackSpeed; // Prevent all enemies attacking at the same time
  }

  update(delta: number) {
    if (this.isExploding) {
      this.addExplosionParts(delta);
      return;
    }

    const prevX = this.x;

    // --- Movement ---
    switch (this.movePattern) {
      case "straight":
        this.y += this.movementYSpeed * delta;
        this.directionChangeTimer -= delta;
        if (this.directionChangeTimer <= 0) {
          this.movementVilocityX = (Math.random() < 0.5 ? -1 : 1) * 80;
          this.directionChangeTimer = 0.5;
        }
        this.x += this.movementVilocityX * delta;
        break;

      case "sine":
        this.y += this.movementYSpeed * delta;
        this.x += Math.sin(this.y / 20) * 1.5;
        break;

      case "zigzag":
        this.y += this.movementYSpeed * delta;
        this.directionChangeTimer -= delta;
        if (this.directionChangeTimer <= 0) {
          this.movementVilocityX = (Math.random() < 0.5 ? -1 : 1) * 80;
          this.directionChangeTimer = 0.5;
        }
        this.x += this.movementVilocityX * delta;
        break;
    }

    // Keep in bounds
    if (this.x < 0) {
      this.x = 0;
      this.movementVilocityX *= -1;
    }
    if (this.x + this.width > drawEngine.canvasWidth) {
      this.x = drawEngine.canvasWidth - this.width;
      this.movementVilocityX *= -1;
    }

    this.velocity.x = (this.x - prevX) / delta;

    this.updateShooting(delta, this.damage, this.bulletSpeed);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isExploding) {
      this.drawExplosionParts(ctx);
    } else {
      ctx.save();
      ctx.drawImage(
        this.glowSprite,
        this.x - this.glowAmount * 2,
        this.y - this.glowAmount * 2
      );

      ctx.drawImage(this.sprite, this.x, this.y);
      this.manageTilt(ctx);
      ctx.restore();
    }
  }

  // Only create one glow sprite for enemies and reuse it, helps with performance
  preloadGlowSprite() {
    const offscreen = document.createElement("canvas");
    offscreen.width = this.sprite.width + this.glowAmount * 4;
    offscreen.height = this.sprite.height + this.glowAmount * 4;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) throw new Error("Failed to get 2D context");

    offCtx.shadowColor = this.glowColor;
    offCtx.shadowBlur = this.glowAmount;
    offCtx.drawImage(this.sprite, this.glowAmount * 2, this.glowAmount * 2);

    return offscreen;
  }

  takeDamage(damage: number) {
    this.life -= damage;
    if (this.life <= 0) this.explode();
  }

  // Don't treat spawned enemies above the canvas as offscreen
  override offScreen(): boolean {
    return (
      this.x + this.width < 0 ||
      this.x > drawEngine.canvasWidth ||
      this.y > drawEngine.canvasHeight
    );
  }
}
