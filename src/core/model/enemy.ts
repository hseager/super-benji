import { drawEngine } from "@/core/draw-engine";
import { Shooter } from "./shooter";
import { BulletPool } from "./bullet-pool";

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
  speed: number;
  sprite: HTMLImageElement;

  // GFX
  glowSprite: HTMLCanvasElement;
  glowColor: string = "#ffb3007c";
  glowAmount: number = 12;

  isExploding = false;
  private explosionPieces: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    rotSpeed: number;
    alpha: number;
    size: number;
    sx: number;
    sy: number;
  }[] = [];

  constructor(
    bulletPool: BulletPool,
    x: number,
    y: number,
    sprite: HTMLImageElement
  ) {
    super(bulletPool, x, y, sprite.width, sprite.height);
    this.speed = 10;
    this.sprite = sprite;
    this.glowSprite = this.preloadGlowSprite();
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

  update(delta: number) {
    if (this.isExploding) {
      for (const p of this.explosionPieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.alpha -= 0.02;
      }
      this.explosionPieces = this.explosionPieces.filter((p) => p.alpha > 0);
    } else {
      this.y += this.speed * delta; // move downward
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isExploding) {
      for (const p of this.explosionPieces) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(
          this.sprite,
          p.sx,
          p.sy,
          p.size,
          p.size,
          -p.size / 2,
          -p.size / 2,
          p.size,
          p.size
        );
        ctx.restore();
      }
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

  explode() {
    if (this.isExploding) return;

    this.isExploding = true;
    const pieceSize = 6;
    const numPieces = 8;

    for (let i = 0; i < numPieces; i++) {
      this.explosionPieces.push({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1,
        size: pieceSize,
        sx: Math.floor(Math.random() * (this.sprite.width - pieceSize)),
        sy: Math.floor(Math.random() * (this.sprite.height - pieceSize)),
      });
    }
  }

  isDead(): boolean {
    return this.isExploding && this.explosionPieces.length === 0;
  }
}
