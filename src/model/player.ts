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

// export const PLAYER_PALETTE = [
//   "#201400", // deep shadow
//   "#402800", // dark panel
//   "#604000", // mid-tone metal
//   "#805800", // light mid-tone
//   "#A07000", // light metal
//   "#C08800", // highlight
//   "#FF7F00", // cockpit/engine glow
// ];

// export const PLAYER_PALETTE = [
//   "#002010", // deep shadow
//   "#004020", // dark panel
//   "#006030", // mid-tone metal
//   "#008040", // light mid-tone
//   "#00A050", // light metal
//   "#00C060", // highlight
//   "#00FF7F", // cockpit/engine glow
// ];

// export const PLAYER_PALETTE = [
//   "#200000", // deep shadow
//   "#400000", // dark panel
//   "#601010", // mid-tone metal
//   "#802020", // light mid-tone
//   "#A03030", // light metal
//   "#C04040", // highlight
//   "#FF3333", // cockpit/engine glow
// ];

const moveTolerance = 1; // Pixels to consider "close enough" to target

export class Player {
  maxLife = playerMaxLife;
  life = playerMaxLife;
  x: number;
  y: number;
  movementSpeed: number = 1.2;

  // GFX
  sprite: HTMLImageElement;
  shootingYPosition = 24; // Offset for shooting position

  // Stats
  attackSpeed = 2000;
  attackCooldown = 0;

  // Track last X position for velocity calculation
  private lastX: number = 0;
  velocityX: number = 0;

  // Glow
  glowColor: string = "#00bfff7c"; // Default glow color
  glowAmount: number = 12; // Default glow radius

  constructor(sprite?: HTMLImageElement) {
    // Position bottom-center of canvas
    this.x = logicalWidth / 2;
    this.y = logicalHeight - 32;

    this.sprite = sprite ?? new Image();
  }

  update(targetX: number, targetY: number) {
    // Need to revist active for mobile
    // if (!active) return;
    // Calculate vector toward target
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > moveTolerance) {
      // Normalize and move toward mouse at fixed speed
      this.x += (dx / distance) * this.movementSpeed;
      this.y += (dy / distance) * this.movementSpeed;
    }

    this.velocityX = this.x - this.lastX;
    this.lastX = this.x;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Glow
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = this.glowAmount;

    this.drawBoosters(ctx);
    this.manageTilt(ctx);

    ctx.restore();
  }

  manageTilt(ctx: CanvasRenderingContext2D) {
    const width = this.sprite.width;
    const height = this.sprite.height;

    const tiltAmount = this.velocityX * 2; // scale factor; tweak for feel
    const centerX = width / 2;

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
        this.x - 12 + x,
        this.y - 28 + offset,
        1,
        height
      );
    }
  }

  private drawBoosters(ctx: CanvasRenderingContext2D) {
    // Booster position relative to sprite bottom
    const boosterX = this.x + 1;
    const boosterY = this.y; // slightly below ship

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
    const flicker = 9 + Math.random() * 3;

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
