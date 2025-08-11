import { BulletPool } from "./bulletPool";
import { GameObject } from "./gameObject";

export class Shooter extends GameObject {
  bulletPool: BulletPool;
  attackCooldown = 0;
  attackSpeed = 0.1; // ms
  shootDir = { x: 0, y: -1 };
  isExploding = false;
  sprite: HTMLImageElement;
  damage: number;
  bulletSpeed: number;

  explosionPieces: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    rotSpeed: number;
    alpha: number;
    size: number;
    sx: number;
    sy: number;
  }[] = [];

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
    super(x, y, width, height);
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

  explode(pieces: number = 8) {
    if (this.isExploding) return;

    this.isExploding = true;
    const pieceSize = 6;
    const numPieces = pieces;

    for (let i = 0; i < numPieces; i++) {
      this.explosionPieces.push({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1,
        size: pieceSize,
        sx: Math.floor(Math.random() * (this.sprite.width - pieceSize)),
        sy: Math.floor(Math.random() * (this.sprite.height - pieceSize)),
      });
    }
  }

  addExplosionParts() {
    for (const p of this.explosionPieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.alpha -= 0.02;
    }
    this.explosionPieces = this.explosionPieces.filter((p) => p.alpha > 0);
  }

  drawExplosionParts(ctx: CanvasRenderingContext2D) {
    for (const p of this.explosionPieces) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(
        this.sprite,
        p.sx,
        p.sy,
        p.size,
        p.size,
        -p.size / 2,
        -p.size / 2,
        p.size,
        p.size
      );
      ctx.restore();
    }
  }

  isDead(): boolean {
    return this.isExploding && this.explosionPieces.length === 0;
  }
}
