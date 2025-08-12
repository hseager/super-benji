import { Coordinates } from "../types";
import { BulletPool } from "./bulletPool";
import { GameObject } from "./gameObject";

export class Shooter extends GameObject {
  // Position
  lastPosition: Coordinates = { x: 0, y: 0 };
  velocity: Coordinates = { x: 0, y: 0 };

  bulletPool: BulletPool;
  attackCooldown = 0;
  attackSpeed = 0.1;
  shootDir = { x: 0, y: -1 };
  damage: number;
  bulletSpeed: number;
  tiltAmount = 3;
  tiltClamp = 2; // Max/min amount of tilting based on movespeed

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

  manageTilt(ctx: CanvasRenderingContext2D) {
    const tiltAmount = Math.max(
      -this.tiltClamp,
      Math.min(this.tiltClamp, this.velocity.x * this.tiltAmount)
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
}
