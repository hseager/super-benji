import { drawEngine } from "../draw-engine";
import { hexToRgbaString } from "../utilities";
import { GameObject } from "./game-object";

export class Bullet extends GameObject {
  dx: number;
  dy: number;
  speed: number;
  active: boolean = false;

  radius = 1;
  glowRadius = 2;
  glowColor = "#00c1fca4";

  constructor(speed: number) {
    super(0, 0);
    this.dx = 0;
    this.dy = 0;
    this.speed = speed;
  }

  fire(x: number, y: number, dirX: number, dirY: number) {
    this.x = x;
    this.y = y;
    this.dx = dirX;
    this.dy = dirY;
    this.active = true;
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  offScreen() {
    return (
      this.y < 0 ||
      this.y > drawEngine.canvasHeight ||
      this.x < 0 ||
      this.x > drawEngine.canvasWidth
    );
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
    gradient.addColorStop(0, hexToRgbaString(this.glowColor, 1)); // solid center
    gradient.addColorStop(0.5, hexToRgbaString(this.glowColor, 0.4)); // mid fade
    gradient.addColorStop(1, hexToRgbaString(this.glowColor, 0.1));

    // Glow
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
