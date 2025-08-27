import { PLAYER_PALETTES } from "../config";
import { Coordinates } from "../types";

export const logicalWidth = 288; // base logical resolution
export const logicalHeight = 512; // base logical resolution

type GradientStop = [number, string];

class DrawController {
  context: CanvasRenderingContext2D;
  mousePosition: DOMPoint;
  // For blinking menu actions
  blinkTimer = 0;
  menuActionBlinkSpeed = 0.75;
  showMenuAction = true;

  constructor() {
    this.context = c2d.getContext("2d");
    this.mousePosition = new DOMPoint(0, 0);

    c2d.addEventListener("mousemove", (event: MouseEvent) => {
      this.mousePosition = this.screenToLogical(event.clientX, event.clientY);
    });

    c2d.addEventListener("touchmove", (event: TouchEvent) => {
      const touch = event.touches[0];
      this.mousePosition = this.screenToLogical(touch.clientX, touch.clientY);
    });

    window.addEventListener("resize", () => this.resizeCanvas());
    this.resizeCanvas();
  }

  private screenToLogical(x: number, y: number): DOMPoint {
    const rect = c2d.getBoundingClientRect();
    const scaleX = logicalWidth / rect.width;
    const scaleY = logicalHeight / rect.height;

    return new DOMPoint((x - rect.left) * scaleX, (y - rect.top) * scaleY);
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  getGoldGradient(
    ctx: CanvasRenderingContext2D,
    y: number,
    height: number = 9
  ) {
    const grad = ctx.createLinearGradient(0, y - height, 0, y);
    grad.addColorStop(0.0, "#fff4c1"); // bright highlight top
    grad.addColorStop(0.25, "#ffd84a"); // gold
    grad.addColorStop(0.5, "#6a2c00"); // orange
    grad.addColorStop(0.75, "#b65a00"); // darker orange-brown
    grad.addColorStop(1.0, "#ff9d00"); // deep shadow bottom
    return grad;
  }

  getGradient(
    ctx: CanvasRenderingContext2D,
    y: number,
    stops: GradientStop[],
    height = 18
  ) {
    const grad = ctx.createLinearGradient(0, y - height, 0, y);
    stops.forEach(([pos, col]) => grad.addColorStop(pos, col));
    return grad;
  }

  drawTitle(text: string, fontSize: number, x: number, y: number) {
    const ctx = this.context;
    const shadowColor = "#0a0601";

    // Main Text
    ctx.save();
    ctx.font = `bold ${fontSize - 2}px "Courier New"`;
    ctx.strokeStyle = shadowColor;
    ctx.fillStyle = shadowColor;
    ctx.textAlign = "center";
    ctx.strokeText(text, x, y + 2);
    ctx.fillText(text, x, y + 2);
    ctx.font = `bold ${fontSize}px "Courier New"`;
    ctx.fillStyle = this.getGradient(ctx, y, [
      [0.0, "#fff4c1"],
      [0.25, "#ffd84a"],
      [0.5, "#6a2c00"],
      [0.75, "#b65a00"],
      [1.0, "#ff9d00"],
    ]);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawText(
    text: string,
    fontSize: number,
    x: number,
    y: number,
    color = "white",
    textAlign: "center" | "left" | "right" = "center",
    strokeColor?: string,
    strokeSize?: number,
    rotation?: number // rotation in radians
  ) {
    const context = this.context;

    context.save();
    context.font = `${fontSize}px "Courier New", monospace`;
    context.textAlign = textAlign;
    context.fillStyle = color;

    if (strokeColor) {
      context.strokeStyle = strokeColor;
    }
    if (strokeSize) {
      context.lineWidth = strokeSize;
    }

    if (rotation) {
      context.translate(x, y);
      context.rotate(rotation);
      if (strokeColor) context.strokeText(text, 0, 0);
      context.fillText(text, 0, 0);
    } else {
      if (strokeColor) context.strokeText(text, x, y);
      context.fillText(text, x, y);
    }

    context.restore();
  }

  drawMenuAction(text: string, delta: number, y: number = 400) {
    this.blinkTimer += delta;

    if (this.blinkTimer >= this.menuActionBlinkSpeed) {
      this.blinkTimer = 0;
      this.showMenuAction = !this.showMenuAction;
    }

    if (this.showMenuAction) {
      const ctx = this.context;
      const fontSize = 24;

      ctx.save();
      ctx.font = `bold ${fontSize}px "Courier New", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Fill text with gradient
      ctx.strokeStyle = "#161616ff";
      ctx.strokeText(text, ctx.canvas.width / 2, y + 1);

      // Steel Gradient
      ctx.fillStyle = this.getGradient(
        ctx,
        y,
        [
          [0.0, "#ffffff"],
          [0.15, "#dcdcdc"],
          [0.3, "#a0a0a0"],
          [0.45, "#f8f8f8"],
          [0.6, "#7a7a7a"],
          [0.8, "#c8c8c8"],
          [1, "#5a5a5a"],
        ],
        20
      );
      ctx.fillText(text, ctx.canvas.width / 2, y);

      ctx.restore();
    }
  }

  drawButton(
    text: string,
    buttonY: number,
    options?: {
      x?: number; // custom x position
      w?: number; // custom width
      h?: number; // custom height
    }
  ) {
    const ctx = this.context;

    const buttonWidth = options?.w ?? 80;
    const buttonHeight = options?.h ?? 20;
    const buttonX = options?.x ?? ctx.canvas.width / 2 - buttonWidth / 2;

    ctx.fillStyle = "#555";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

    return { x: buttonX, y: buttonY, w: buttonWidth, h: buttonHeight };
  }

  resizeCanvas() {
    const targetRatio = logicalWidth / logicalHeight;
    const screenRatio = window.innerWidth / window.innerHeight;

    let displayWidth: number;
    let displayHeight: number;

    if (screenRatio > targetRatio) {
      // Screen is wider than target, fit height
      displayHeight = window.innerHeight;
      displayWidth = displayHeight * targetRatio;
    } else {
      // Screen is taller/narrower, fit width
      displayWidth = window.innerWidth;
      displayHeight = displayWidth / targetRatio;
    }

    this.context.canvas.style.width = `${displayWidth}px`;
    this.context.canvas.style.height = `${displayHeight}px`;
    this.context.imageSmoothingEnabled = false;
  }

  drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number = 6,
    fillStyle?: string,
    strokeStyle?: string
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  }

  drawBenjiCoin(image: HTMLImageElement, position: Coordinates, size = 25) {
    const ctx = this.context;
    // Draw coin circle
    const goldPalette = PLAYER_PALETTES.find(([key]) => key === "gold")![1];

    ctx.save();
    ctx.beginPath();
    ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
    ctx.fillStyle = goldPalette[4]; // gold color
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = goldPalette[5]; // darker gold rim
    ctx.stroke();
    ctx.closePath();

    // Clip to circle so image stays inside coin
    ctx.clip();

    // Draw image centered inside coin
    const imgSize = size * 1.4; // scale factor for image inside circle
    ctx.drawImage(
      image,
      position.x - (imgSize * 0.75) / 2,
      position.y - imgSize / 2,
      imgSize * 0.8,
      imgSize
    );

    ctx.restore();
  }

  getCenterX() {
    return drawEngine.context.canvas.width / 2;
  }
}

export const drawEngine = new DrawController();
