import { drawEngine } from "@/core/draw-engine";

export const ENEMY_PALETTE = [
  "#200000", // deep shadow
  "#190202", // dark panel
  "#290303", // mid-tone metal
  "#310c0c", // light mid-tone
  "#A03030", // light metal
  "#c04040", // highlight
  "#e67c7c", // cockpit/engine glow
];

export class Enemy {
  x: number;
  y: number;
  speed: number;
  sprite: HTMLImageElement;

  width = 14; // adjust to your sprite
  height = 14;

  // GFX
  glowColor: string = "#ffb3007c"; // Default glow color
  glowAmount: number = 12; // Default glow radius

  constructor(x: number, y: number, sprite?: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.speed = 10; // faster with each level
    this.sprite = sprite ?? new Image();
  }

  update(delta: number) {
    this.y += this.speed * delta; // move downward
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = this.glowAmount;

    ctx.drawImage(this.sprite, this.x - 16, this.y - 16);
  }

  offScreen(): boolean {
    return (
      this.x + this.width < 0 ||
      this.x > drawEngine.canvasWidth ||
      this.y + this.height < 0 ||
      this.y > drawEngine.canvasHeight
    );
  }
}
