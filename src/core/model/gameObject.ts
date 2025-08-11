export class GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean; // Used for preventing duplicate collision
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
  isExploding = false;
  sprite: HTMLImageElement;

  constructor(
    sprite: HTMLImageElement,
    x: number,
    y: number,
    width: number = 0,
    height: number = 0,
    active: boolean = true
  ) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = active;
  }

  centerX(): number {
    return this.x + this.width / 2;
  }

  centerY(): number {
    return this.y + this.height / 2;
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
