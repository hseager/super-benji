import { Flip, SpriteSheet } from "./sprite-sheet";

export class CanvasBuffer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d")!;
  }

  drawSprite(
    sheet: SpriteSheet,
    dx: number,
    dy: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    flip: Flip = Flip.None,
    rotation?: number
  ) {
    sheet.draw(this.ctx, dx, dy, sx, sy, sw, sh, flip, rotation);
  }

  toImage(): HTMLImageElement {
    const img = new Image();
    img.src = this.canvas.toDataURL();
    return img;
  }
}
