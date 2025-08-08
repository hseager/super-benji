import { hexToRgbaString } from "@/core/utilities";
import { GameObject } from "./game-object";

export class Bullet extends GameObject {
  speed = 6;
  radius = 1;
  glowRadius = 2; // Glow radius for visual effect

  constructor(x: number, y: number) {
    super(x, y, 1, 1);
  }

  update() {
    this.y -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D, color: string = "#cccccc") {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius * this.glowRadius // glow radius
    );
    gradient.addColorStop(0, hexToRgbaString(color, 1)); // solid center
    gradient.addColorStop(0.5, hexToRgbaString(color, 0.5)); // mid fade
    gradient.addColorStop(1, hexToRgbaString(color, 0));

    // Glow
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  offScreen() {
    return this.y + this.radius < 0;
  }
}
