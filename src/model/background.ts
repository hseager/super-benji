const BACKGROUND_COLOR = "#0a0d1fff";

const BACKGROUND_PALETTE = [
  "#4d592aff",
  "#231952ff",
  "#38454eff",
  "#353550ff",
  "#5555FF",
  "#5b4949ff",
];

export class Background {
  tile: HTMLImageElement = new Image();
  y = 0;
  x = 0;
  speed = 0.4;
  private xMovementBuffer = 100;
  private XMovementAmount = 0.4;

  constructor() {
    this.tile = this.generateStarTile(128, 0.01);
  }

  update(playerVelocityX: number) {
    this.y += this.speed;
    this.x -= playerVelocityX * this.XMovementAmount; // Adjust background speed based on player movement
    if (this.y >= this.tile.height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    ctx.imageSmoothingEnabled = false;

    if (!this.tile.complete) return;

    const pattern = ctx.createPattern(this.tile, "repeat");
    if (!pattern) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = pattern;
    ctx.fillRect(
      -this.tile.width / 4,
      -this.tile.height,
      width + this.xMovementBuffer,
      height + this.tile.height
    );
    ctx.restore();

    this.y += this.speed;
    if (this.y >= this.tile.height) this.y = 0;
  }

  generateStarTile(size = 64, density = 0.01): HTMLImageElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, size, size);

    // Draw a few big soft nebula blobs with globalAlpha for better perf
    ctx.globalAlpha = 0.2;
    // this.drawNebula(ctx, size);
    ctx.globalAlpha = 1;

    const totalStars = Math.floor(size * size * density);
    for (let i = 0; i < totalStars; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      ctx.fillStyle =
        BACKGROUND_PALETTE[
          Math.floor(Math.random() * BACKGROUND_PALETTE.length)
        ];
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  // drawNebula(ctx: CanvasRenderingContext2D, size: number) {
  //   const colors = [
  //     "#6496FF", // soft blue
  //     "#FF9664", // soft orange
  //     "#96FFC8", // soft teal
  //   ];

  //   for (let i = 0; i < 2; i++) {
  //     const x = Math.random() * (size * 2) - size / 2; // range: -size/2 to 1.5*size
  //     const y = Math.random() * (size * 2) - size / 2;
  //     const radius = size * (0.3 + Math.random() * 0.3);

  //     const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  //     gradient.addColorStop(0, colors[i]);
  //     gradient.addColorStop(1, "rgba(0,0,0,0)");

  //     ctx.fillStyle = gradient;
  //     ctx.beginPath();
  //     ctx.arc(x, y, radius, 0, Math.PI * 2);
  //     ctx.fill();
  //   }
  // }
}
