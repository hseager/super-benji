import { playerMaxLife } from "@/core/config";
import { logicalHeight, logicalWidth } from "@/core/draw-engine";

export const PLAYER_PALETTE = [
  "#202020", // deep shadow
  "#404040", // dark panel
  "#606060", // mid-tone metal
  "#808080", // light mid-tone
  "#A0A0A0", // light metal
  "#C0C0C0", // highlight
  "#00BFFF", // cockpit/engine glow
];

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

    this.drawBoosters(ctx);
    this.manageTilt(ctx);

    ctx.restore();
  }

  manageTilt(ctx: CanvasRenderingContext2D) {
    const width = this.sprite.width;
    const height = this.sprite.height;

    const tiltAmount = this.velocityX * 2; // scale factor; tweak for feel
    const centerX = 8;

    for (let x = 0; x < width; x++) {
      // Factor goes -1 (left) → 1 (right)
      const factor = (x - centerX) / centerX;

      // Invert shift for right/left sides
      // When moving right: left side goes up, right side goes down
      const offset = Math.floor(factor * tiltAmount);

      ctx.drawImage(
        this.sprite,
        x,
        0,
        1,
        height,
        this.x - 8 + x,
        this.y - 24 + offset,
        1,
        height
      );
    }
  }

  private drawBoosters(ctx: CanvasRenderingContext2D) {
    // Booster position relative to sprite bottom
    const boosterX = this.x;
    const boosterY = this.y - 2; // slightly below ship

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
    const flicker = 5 + Math.random() * 3;

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
  }
}
