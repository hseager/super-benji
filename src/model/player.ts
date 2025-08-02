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

  private lastX: number = 0;
  private velocityX: number = 0;

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

    this.velocityX = this.x - this.lastX;
    this.lastX = this.x;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Optional glow like your circle
    ctx.shadowColor = "#0ff";
    ctx.shadowBlur = 20;

    const width = this.sprite.width;
    const height = this.sprite.height;

    const tiltAmount = this.velocityX * 3; // scale factor; tweak for feel

    // Draw column by column, shifting vertically
    for (let x = 0; x < width; x++) {
      // Map x (column index) to tilt offset
      const factor = x / width - 0.5; // -0.5 (left) to 0.5 (right)
      const yOffset = Math.round(factor * tiltAmount); // more shift on edges

      ctx.drawImage(
        this.sprite,
        x,
        0,
        1,
        height, // 1-pixel wide vertical strip
        this.x - 8 + x,
        this.y - 24 + yOffset,
        1,
        height
      );
    }

    ctx.restore();
  }

  takeDamage(damage: number) {
    this.life -= damage;
  }
}
