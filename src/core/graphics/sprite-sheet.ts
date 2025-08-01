export enum Flip {
  None = 0,
  Horizontal = 1,
  Vertical = 2,
}

export class SpriteSheet {
  image: HTMLImageElement;

  constructor(image: HTMLImageElement) {
    this.image = image;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    flip: Flip = Flip.None,
    rotation?: number
  ) {
    ctx.save();

    // Apply horizontal/vertical flips
    if (flip & Flip.Horizontal) {
      ctx.translate(dx + sw, dy);
      ctx.scale(-1, 1);
      dx = 0;
    }
    if (flip & Flip.Vertical) {
      ctx.translate(dx, dy + sh);
      ctx.scale(1, -1);
      dy = 0;
    }

    // Apply rotation
    if (rotation) {
      ctx.translate(dx + sw / 2, dy + sh / 2);
      ctx.rotate(rotation);
      dx = -sw / 2;
      dy = -sh / 2;
    }

    ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, sw, sh);
    ctx.restore();
  }
}
