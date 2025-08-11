import { drawEngine } from "../controllers/DrawController";
import { GameObject } from "./gameObject";

export class Bullet extends GameObject {
  dx: number;
  dy: number;
  active: boolean = false;

  // GFX
  sprite: HTMLImageElement;
  radius = 2;
  glowRadius = 2;
  glowColor: string;

  // Stats
  damage = 1;
  speed = 1;

  constructor(sprite: HTMLImageElement, color: string) {
    super(sprite, 0, 0);
    this.dx = 0;
    this.dy = 0;
    this.glowColor = color;
    this.sprite = sprite;
  }

  fire(x: number, y: number, dirX: number, dirY: number) {
    this.x = x;
    this.y = y;
    this.dx = dirX;
    this.dy = dirY;
    this.active = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isExploding) {
      this.drawExplosionParts(ctx);
    } else {
      ctx.drawImage(this.sprite, this.x, this.y);
    }
  }

  update(delta: number) {
    if (this.isExploding) {
      this.addExplosionParts();
      if (this.isDead()) {
        this.isExploding = false;
        this.active = false;
      }
    } else {
      this.x += this.dx * this.speed * delta;
      this.y += this.dy * this.speed * delta;
    }
  }

  offScreen() {
    return (
      this.y < 0 ||
      this.y > drawEngine.canvasHeight ||
      this.x < 0 ||
      this.x > drawEngine.canvasWidth
    );
  }
}
