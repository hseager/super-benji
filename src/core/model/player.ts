import { PLAYER_MAX_LIFE } from "@/core/config";
import { logicalHeight, logicalWidth } from "@/core/controllers/DrawController";
import { Shooter } from "./shooter";
import { BulletPool } from "./bulletPool";
import { getInterpolatedColor } from "../utilities";

export const PLAYER_PALETTE = [
  "#202020", // deep shadow
  "#404040", // dark panel
  "#606060", // mid-tone metal
  "#808080", // light mid-tone
  "#A0A0A0", // light metal
  "#C0C0C0", // highlight
  "#00BFFF", // cockpit/engine glow
];

const healthColors = [
  { hp: 1.0, color: "#00FF66" }, // green
  { hp: 0.75, color: "#00BFFF" }, // blue
  { hp: 0.5, color: "#FFA500" }, // orange
  { hp: 0.25, color: "#FF3333" }, // red
  { hp: 0.0, color: "rgba(255, 0, 0, 0)" }, // transparent red
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

export class Player extends Shooter {
  // Position
  private lastX: number = 0; // Track last X position for velocity calculation
  velocityX: number = 0;

  // Movement
  movementXSpeed: number = 1.5;
  movementYSpeed: number = 0.5;
  moveTolerance = 2; // Pixels to consider "close enough" to target

  // GFX
  sprite: HTMLImageElement;
  shootingYPosition = -24; // Offset for shooting position
  shootingXPosition = 1; // Offset for shooting position
  boosterSize = 6; // Size of the booster flame
  boosterYOffset = -2; // Offset for booster flame position
  tiltAmount = 3;
  tiltClamp = 2; // Max/min amount of tilting based on movespeed

  // Glow
  glowColor: string = "#00bfff7c"; // Default glow color
  glowAmount: number = 12; // Default glow radius

  // Stats
  maxLife = PLAYER_MAX_LIFE;
  life = PLAYER_MAX_LIFE;
  attackSpeed: number = 0.5;

  constructor(sprite: HTMLImageElement, bulletPool: BulletPool) {
    super(
      sprite,
      bulletPool,
      logicalWidth / 2,
      logicalHeight - sprite.height,
      sprite.width,
      sprite.height
    );
    this.sprite = sprite;
  }

  update(delta: number, targetX: number, targetY: number) {
    if (this.isExploding) {
      this.addExplosionParts();
    } else {
      // Movement towards cursor
      const dx = targetX - this.centerX(); // Center the target on the player
      const dy = targetY - this.centerY();
      const distance = Math.hypot(dx, dy);

      if (distance > this.moveTolerance) {
        // Normalize and move toward mouse at fixed speed
        this.x += (dx / distance) * this.movementXSpeed;
        this.y += (dy / distance) * this.movementYSpeed;
      }

      this.velocityX = this.x - this.lastX;
      this.lastX = this.x;

      this.glowColor = getInterpolatedColor(
        this.life / this.maxLife,
        healthColors
      );

      this.updateShooting(delta);
      this.shoot();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isExploding) {
      this.drawExplosionParts(ctx);
    } else {
      ctx.save();

      // Glow
      ctx.shadowColor = this.glowColor;
      ctx.shadowBlur = this.glowAmount;

      this.drawBoosters(ctx);
      this.manageTilt(ctx);

      ctx.restore();
    }
  }

  manageTilt(ctx: CanvasRenderingContext2D) {
    const tiltAmount = Math.max(
      -this.tiltClamp,
      Math.min(this.tiltClamp, this.velocityX * this.tiltAmount)
    );

    const centerX = this.width / 2;

    for (let x = 0; x < this.width; x++) {
      const factor = (x - centerX) / centerX;

      // Invert shift for right/left sides
      // When moving right: left side goes up, right side goes down
      const offset = Math.floor(factor * tiltAmount);

      ctx.drawImage(
        this.sprite,
        x,
        0,
        1,
        this.height,
        this.x + x,
        this.y + offset,
        1,
        this.height
      );
    }
  }

  private drawBoosters(ctx: CanvasRenderingContext2D) {
    const boosterX = this.centerX();
    const boosterY = this.y + this.height + this.boosterYOffset;

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
    const flicker = this.boosterSize + Math.random() * 3;

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
