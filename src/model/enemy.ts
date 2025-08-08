import { drawEngine } from "@/core/draw-engine";
import { GameObject } from "./game-object";

export const ENEMY_PALETTE = [
  "#200000", // deep shadow
  "#190202", // dark panel
  "#290303", // mid-tone metal
  "#310c0c", // light mid-tone
  "#A03030", // light metal
  "#c04040", // highlight
  "#e67c7c", // cockpit/engine glow
];

export class Enemy extends GameObject {
  speed: number;
  sprite: HTMLImageElement;

  // GFX
  glowColor: string = "#ffb3007c";
  glowAmount: number = 12;

  private exploding = false;
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

  constructor(x: number, y: number, sprite: HTMLImageElement) {
    super(x, y, sprite.width, sprite.height);
    this.speed = 10;
    this.sprite = sprite;
  }

  update(delta: number) {
    if (this.exploding) {
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
    if (this.exploding) {
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
      ctx.shadowColor = this.glowColor;
      ctx.shadowBlur = this.glowAmount;

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
    if (this.exploding) return;

    this.exploding = true;
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
    return this.exploding && this.explosionPieces.length === 0;
  }
}
