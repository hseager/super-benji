import { hexToRgbaString, randomisePalette } from "@/core/utilities";
import { BACKGROUND_MOVEMENT_Y_SPEED } from "../config";
import { Coordinates } from "../types";

const BASE_BACKGROUND_PALETTE = [
  "#06040f", // BG colour
  "#4d592a",
  "#231952",
  "#354652",
  "#353550",
  "#363692",
  "#69416e",
];

interface BackgroundLayer {
  palette: string[];
  tile: HTMLImageElement;
  offsetX: number;
  offsetY: number;
  speedY: number;
  speedXMultiplier: number;
}

export class Background {
  layers: BackgroundLayer[] = [];
  private xMovementBuffer = 100;
  private XMovementAmount = 0.4;
  private tileSize = 256;

  constructor() {
    // Randomise a base palette
    const basePalette = randomisePalette(BASE_BACKGROUND_PALETTE);

    // Create layers with different densities and speeds for parallax effect
    this.layers.push(
      this.createLayer(
        basePalette,
        this.tileSize,
        0.001,
        BACKGROUND_MOVEMENT_Y_SPEED * 0.4,
        0.2,
        1
      )
    );
    this.layers.push(
      this.createLayer(
        basePalette,
        this.tileSize,
        0.002,
        BACKGROUND_MOVEMENT_Y_SPEED * 0.6,
        0.3,
        1.2
      )
    );
    this.layers.push(
      this.createLayer(
        basePalette,
        this.tileSize,
        0.003,
        BACKGROUND_MOVEMENT_Y_SPEED * 1,
        0.4,
        1.2
      )
    );
  }

  private createLayer(
    palette: string[],
    tileSize: number,
    starDensity: number,
    speedY: number,
    speedXMultiplier: number,
    starSize: number
  ): BackgroundLayer {
    const tile = this.generateStarTile(
      tileSize,
      starDensity,
      palette,
      starSize
    );
    return {
      palette,
      tile,
      offsetX: 0,
      offsetY: 0,
      speedY,
      speedXMultiplier,
    };
  }

  update(delta: number, playerVelocity: Coordinates = { x: 0, y: 0 }) {
    for (const layer of this.layers) {
      if (layer.tile.width === 0 || layer.tile.height === 0) {
        // Tile not loaded yet, skip updating this layer
        continue;
      }

      layer.offsetY =
        (layer.offsetY +
          layer.speedY * delta -
          playerVelocity.y * 0.5 * layer.speedXMultiplier) %
        layer.tile.height;

      if (layer.offsetY < 0) {
        layer.offsetY += layer.tile.height; // prevent negative values
      }

      layer.offsetX =
        (layer.offsetX -
          playerVelocity.x * this.XMovementAmount * layer.speedXMultiplier) %
        layer.tile.width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    ctx.imageSmoothingEnabled = false;

    const layer = this.layers[0];
    ctx.save();
    ctx.fillStyle = layer.palette[0];
    ctx.fillRect(0, 0, width, height);

    for (const layer of this.layers) {
      if (!layer.tile.complete) continue;

      const pattern = ctx.createPattern(layer.tile, "repeat");
      if (!pattern) continue;

      ctx.save();
      // Translate by the negative offsets to scroll the pattern seamlessly
      ctx.translate(layer.offsetX, layer.offsetY);

      ctx.fillStyle = pattern;
      ctx.fillRect(
        -layer.tile.width / 4,
        -layer.tile.height,
        width + this.xMovementBuffer,
        height + layer.tile.height
      );
      ctx.restore();
    }
  }

  generateStarTile(
    size = 128,
    density = 0.01,
    palette: string[] = BASE_BACKGROUND_PALETTE,
    starSize: number
  ): HTMLImageElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Stars
    const totalStars = Math.floor(size * size * density);
    for (let i = 0; i < totalStars; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
      ctx.fillRect(x, y, starSize, starSize);
    }

    // Add nebula clouds
    this.drawGalaxyClouds(ctx, size, 2, palette);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  private drawGalaxyClouds(
    ctx: CanvasRenderingContext2D,
    size: number,
    count: number,
    palette: string[]
  ) {
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * (size / 2) + size / 3;
      const x = Math.random() * size;
      const y = Math.random() * size;
      this.drawWrappedGradient(ctx, x, y, radius, size, palette);
    }
  }

  private drawWrappedGradient(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    size: number,
    palette: string[]
  ) {
    for (let offsetX = -size; offsetX <= size; offsetX += size) {
      for (let offsetY = -size; offsetY <= size; offsetY += size) {
        const grad = ctx.createRadialGradient(
          x + offsetX,
          y + offsetY,
          0,
          x + offsetX,
          y + offsetY,
          radius
        );

        grad.addColorStop(0, hexToRgbaString(palette[5], 0.1));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    }
  }
}
