import { PLAYER_BULLET_PALETTES } from "../config";
import { GameController } from "../controllers/GameController";
import { Coordinates } from "../types";
import { BulletPool } from "./bulletPool";
import { GameObject } from "./gameObject";

export class Shooter extends GameObject {
  gameController: GameController;

  // Position
  lastPosition: Coordinates = { x: 0, y: 0 };
  velocity: Coordinates = { x: 0, y: 0 };
  shootingXOffset = 0;

  bulletPool: BulletPool;
  attackCooldown = 0;
  attackSpeed = 0.1;
  shootDir = { x: 0, y: -1 };
  tiltAmount = 3;
  tiltClamp = 3; // Max/min amount of tilting based on movespeed

  constructor(
    gameController: GameController,
    sprite: HTMLImageElement,
    bulletPool: BulletPool,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(sprite, x, y, width, height);
    this.gameController = gameController;
    this.sprite = sprite;
    this.bulletPool = bulletPool;
  }

  updateShooting(delta: number) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }

  shoot(
    damage: number,
    bulletSpeed: number,
    bulletColor?: keyof typeof PLAYER_BULLET_PALETTES
  ) {
    if (this.attackCooldown <= 0) {
      if (!this.bulletPool) return;
      const bullet = this.bulletPool.get();
      if (bullet) {
        if (bulletColor) {
          bullet.sprite =
            this.gameController.spriteManager.getBulletSprite(bulletColor);
        }

        const y = this.shootDir.y <= 0 ? this.y : this.y + this.height;
        bullet.damage = damage;
        bullet.speed = bulletSpeed;
        bullet.fire(
          this.centerX() + this.shootingXOffset,
          y,
          this.shootDir.x,
          this.shootDir.y
        );
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
