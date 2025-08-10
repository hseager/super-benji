import { drawEngine } from "@/core/controllers/DrawController";
import { Shooter } from "./shooter";
import { BulletPool } from "./bulletPool";

export const ENEMY_PALETTE = [
  "#200000", // deep shadow
  "#190202", // dark panel
  "#290303", // mid-tone metal
  "#310c0c", // light mid-tone
  "#A03030", // light metal
  "#c04040", // highlight
  "#e67c7c", // cockpit/engine glow
];

export class Enemy extends Shooter {
  // GFX
  glowSprite: HTMLCanvasElement;
  glowColor: string = "#ffb3007c";
  glowAmount: number = 12;

  // Stats
  speed: number = 10;
  vx: number = 0;
  proximityDamage: number = 0.5;
  bulletDamage: number = 0.5;
  attackSpeed: number = 1.5;
  shootDir = { x: 0, y: 1 };

  constructor(
    sprite: HTMLImageElement,
    bulletPool: BulletPool,
    x: number,
    y: number
  ) {
    super(sprite, bulletPool, x, y, sprite.width, sprite.height);
    this.glowSprite = this.preloadGlowSprite();
    this.vx = (Math.random() - 0.5) * 60;
  }

  update(delta: number) {
    if (this.isExploding) {
      this.addExplosionParts();
    } else {
      // Move
      this.y += this.speed * delta; // down
      this.x += this.vx * delta; // sideways

      // Bounce at screen edges
      if (this.x < 0) {
        this.x = 0;
        this.vx *= -1;
      }
      if (this.x + this.width > drawEngine.canvasWidth) {
        this.x = drawEngine.canvasWidth - this.width;
        this.vx *= -1;
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

  offScreen(): boolean {
    return (
      this.x + this.width < 0 ||
      this.x > drawEngine.canvasWidth ||
      this.y + this.height < 0 ||
      this.y > drawEngine.canvasHeight
    );
  }

  preloadGlowSprite() {
    const offscreen = document.createElement("canvas");
    offscreen.width = this.sprite.width + this.glowAmount * 4; // enough padding
    offscreen.height = this.sprite.height + this.glowAmount * 4;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) throw new Error("Failed to get 2D context");

    offCtx.shadowColor = this.glowColor;
    offCtx.shadowBlur = this.glowAmount;
    offCtx.drawImage(this.sprite, this.glowAmount * 2, this.glowAmount * 2);

    return offscreen;
  }
}
