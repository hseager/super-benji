export class GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean; // Used for preventing duplicate collision

  constructor(
    x: number,
    y: number,
    width: number = 0,
    height: number = 0,
    active: boolean = true
  ) {
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
}
