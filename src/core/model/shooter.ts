import { BulletPool } from "./bullet-pool";
import { GameObject } from "./game-object";

export class Shooter extends GameObject {
  bulletPool: BulletPool;
  attackCooldown = 0;
  attackSpeed = 0.1; // ms
  shootDir = { x: 0, y: -1 };

  constructor(
    bulletPool: BulletPool,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(x, y, width, height);
    this.bulletPool = bulletPool;
  }

  updateShooting(delta: number) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  shoot() {
    if (this.attackCooldown <= 0) {
      const bullet = this.bulletPool.get();
      if (bullet) {
        bullet.fire(this.centerX(), this.y, this.shootDir.x, this.shootDir.y);
        this.attackCooldown = this.attackSpeed;
      }
    }
  }
}
