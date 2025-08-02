import { playerMaxLife } from "@/core/config";
import { logicalHeight, logicalWidth } from "@/core/draw-engine";

const moveTolerance = 1; // Pixels to consider "close enough" to target

export class Player {
  maxLife = playerMaxLife;
  life = playerMaxLife;
  x: number;
  y: number;
  speed: number;
  sprite: HTMLImageElement;

  constructor(sprite?: HTMLImageElement) {
    this.speed = 1.2;
    // Position bottom-center of canvas
    this.x = logicalWidth / 2;
    this.y = logicalHeight - 40;

    this.sprite = sprite ?? new Image();
  }

  update(targetX: number, targetY: number, active: boolean) {
    // Need to revist active for mobile
    // if (!active) return;
    // Calculate vector toward target
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > moveTolerance) {
      // Normalize and move toward mouse at fixed speed
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Optional glow like your circle
    ctx.shadowColor = "#0ff";
    ctx.shadowBlur = 20;

    // Draw composite sprite (32x24 like JS13k)
    ctx.drawImage(this.sprite, this.x - 8, this.y - 24);

    ctx.restore();
  }

  takeDamage(damage: number) {
    this.life -= damage;
  }
}
