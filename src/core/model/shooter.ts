import { BulletPool } from "./bulletPool";
import { GameObject } from "./gameObject";

export class Shooter extends GameObject {
  bulletPool: BulletPool;
  attackCooldown = 0;
  attackSpeed = 0.1;
  shootDir = { x: 0, y: -1 };
  damage: number;
  bulletSpeed: number;

  constructor(
    sprite: HTMLImageElement,
    bulletPool: BulletPool,
    damage: number,
    bulletSpeed: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(sprite, x, y, width, height);
    this.sprite = sprite;
    this.bulletPool = bulletPool;
    this.damage = damage;
    this.bulletSpeed = bulletSpeed;
  }

  updateShooting(delta: number) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  shoot() {
    if (this.attackCooldown <= 0) {
      if (!this.bulletPool) return;
      const bullet = this.bulletPool.get();
      if (bullet) {
        const y = this.shootDir.y <= 0 ? this.y : this.y + this.height;
        bullet.damage = this.damage;
        bullet.speed = this.bulletSpeed;
        bullet.fire(this.centerX(), y, this.shootDir.x, this.shootDir.y);
        this.attackCooldown = this.attackSpeed;
      }
    }
  }
}
