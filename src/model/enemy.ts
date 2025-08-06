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

  constructor(x: number, y: number, sprite: HTMLImageElement) {
    console.log(sprite.width, sprite.height);
    // TODO these are still 0 0
    super(x, y, 14, 14);
    this.speed = 10;
    this.sprite = sprite;
  }

  update(delta: number) {
    this.y += this.speed * delta; // move downward
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = this.glowAmount;

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.glowColor;
    ctx.fill();

    ctx.drawImage(this.sprite, this.x, this.y);
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
