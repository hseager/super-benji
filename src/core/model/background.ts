import { hexToRgbaString, randomisePalette } from "@/core/utilities";
import { BACKGROUND_MOVEMENT_Y_SPEED } from "../config";

const BASE_BACKGROUND_PALETTE = [
  "#06040f", // BG colour
  "#4d592a",
  "#231952",
  "#354652",
  "#353550",
  "#363692",
  "#69416e",
];

export class Background {
  tile: HTMLImageElement = new Image();
  y = 0;
  x = -10;
  speed = BACKGROUND_MOVEMENT_Y_SPEED;
  private xMovementBuffer = 100;
  private XMovementAmount = 0.4;
  pallette: string[];
  private starDensityMax = 0.005;
  private starDensityMin = 0.002;
  starDensity =
    Math.random() * (this.starDensityMax - this.starDensityMin) +
    this.starDensityMin;

  constructor() {
    this.pallette = randomisePalette(BASE_BACKGROUND_PALETTE);
    this.tile = this.generateStarTile(128, this.starDensity);
  }

  update(delta: number, playerVelocityX?: number) {
    this.y += this.speed * delta;
    if (playerVelocityX) this.x -= playerVelocityX * this.XMovementAmount;
    if (this.y >= this.tile.height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    ctx.imageSmoothingEnabled = false;

    if (!this.tile.complete) return;

    const pattern = ctx.createPattern(this.tile, "repeat");
    if (!pattern) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = pattern;
    ctx.fillRect(
      -this.tile.width / 4,
      -this.tile.height,
      width + this.xMovementBuffer,
      height + this.tile.height
    );
    ctx.restore();
  }

  generateStarTile(size = 64, density = 0.01): HTMLImageElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Base background
    ctx.fillStyle = this.pallette[0];
    ctx.fillRect(0, 0, size, size);

    // Stars
    const totalStars = Math.floor(size * size * density);
    for (let i = 0; i < totalStars; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      ctx.fillStyle =
        this.pallette[Math.floor(Math.random() * this.pallette.length)];
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add nebula clouds
    this.drawGalaxyClouds(ctx, size, 3);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  private drawGalaxyClouds(
    ctx: CanvasRenderingContext2D,
    size: number,
    count: number
  ) {
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * (size / 2) + size / 3;
      const x = Math.random() * size;
      const y = Math.random() * size;

      // Draw the gradient and wrap around edges
      this.drawWrappedGradient(ctx, x, y, radius, size);
    }
  }

  private drawWrappedGradient(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    size: number
  ) {
    // We'll draw the gradient in 9 tiles (center + wrap-around edges) so it tiles seamlessly
    for (let offsetX = -size; offsetX <= size; offsetX += size) {
      for (let offsetY = -size; offsetY <= size; offsetY += size) {
        const grad = ctx.createRadialGradient(
          x + offsetX,
          y + offsetY,
          0,
          x + offsetX,
          y + offsetY,
          radius
        );

        grad.addColorStop(0, hexToRgbaString(this.pallette[5], 0.07));
        grad.addColorStop(1, "rgba(0,0,0,0)"); // fade to transparent

        ctx.globalCompositeOperation = "screen"; // blend mode for glow
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over"; // reset
      }
    }
  }
}
