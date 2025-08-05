export class GameObject {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number = 0, height: number = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
