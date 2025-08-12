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

  constructor(
    sprite: HTMLImageElement,
    bulletPool: BulletPool,
    bulletDamage: number,
    bulletSpeed: number,
    x: number,
    y: number
  ) {
    super(
      sprite,
      bulletPool,
      bulletDamage,
      bulletSpeed,
      x,
      y,
      sprite.width,
      sprite.height
    );
    this.glowSprite = this.preloadGlowSprite();
    this.movementVilocityX = (Math.random() - 0.5) * 60;

    // Give each enemy attack speed variance
    this.attackSpeed =
      ENEMY_ATTACK_SPEED + (Math.random() * 2 - 1) * ENEMY_ATTACK_VARIANCE;
    this.attackCooldown = Math.random() * this.attackSpeed; // Prevent all enemies attacking at the same time
  }

  update(delta: number) {
    if (this.isExploding) {
      this.addExplosionParts(delta);
    } else {
      // Move
      this.y += this.movementYSpeed * delta; // down
      this.x += this.movementVilocityX * delta; // sideways

      // Bounce at screen edges
      if (this.x < 0) {
        this.x = 0;
        this.movementVilocityX *= -1;
      }
      if (this.x + this.width > drawEngine.canvasWidth) {
        this.x = drawEngine.canvasWidth - this.width;
        this.movementVilocityX *= -1;
      }

      this.updateShooting(delta);
      this.shoot();
    }
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
