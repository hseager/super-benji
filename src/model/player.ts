import { playerMaxLife } from "@/core/config";
import { drawEngine } from "@/core/draw-engine";

export class Player {
  maxLife = playerMaxLife;
  life = playerMaxLife;
  x: number;
  y: number;
  radius: number;
  speed: number;

  constructor() {
    this.radius = 15;
    this.speed = 4;
    this.life = 3;

    // Position bottom-center of canvas
    this.x = drawEngine.canvasWidth / 2;
    this.y = drawEngine.canvasHeight - 40 - this.radius * 2;
  }

  update(targetX: number, targetY: number, active: boolean) {
    if (!active) return;
    // Calculate vector toward target
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      // Normalize and move toward mouse at fixed speed
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowColor = "#0ff"; // glow color
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  takeDamage(damage: number) {
    this.life -= damage;
  }
}
