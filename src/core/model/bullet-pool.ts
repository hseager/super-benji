import { Bullet } from "./bullet";

export class BulletPool {
  pool: Bullet[] = [];

  constructor(size: number, bulletFactory: () => Bullet) {
    for (let i = 0; i < size; i++) {
      const bullet = bulletFactory();
      bullet.active = false;
      this.pool.push(bullet);
    }
  }

  get(): Bullet | null {
    for (const bullet of this.pool) {
      if (!bullet.active) {
        bullet.active = true;
        return bullet;
      }
    }
    return null; // No free bullets
  }

  updateAll() {
    for (const bullet of this.pool) {
      if (bullet.active) {
        bullet.update();
        if (bullet.offScreen()) {
          bullet.active = false;
        }
      }
    }
  }

  drawAll(ctx: CanvasRenderingContext2D) {
    for (const bullet of this.pool) {
      if (bullet.active) {
        bullet.draw(ctx);
      }
    }
  }
}
