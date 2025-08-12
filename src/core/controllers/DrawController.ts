export const logicalWidth = 144; // base logical resolution
export const logicalHeight = 256; // base logical resolution

class DrawController {
  context: CanvasRenderingContext2D;
  mousePosition: DOMPoint;
  isPointerDown: boolean = false;
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

    c2d.addEventListener("mousedown", () => (this.isPointerDown = true));
    c2d.addEventListener("mouseup", () => (this.isPointerDown = false));

    c2d.addEventListener("touchstart", () => {
      this.isPointerDown = true;
    });
    c2d.addEventListener("touchend", () => (this.isPointerDown = false));

    window.addEventListener("resize", () => this.resizeCanvas());
    window.addEventListener("orientationchange", () => this.resizeCanvas());
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

  getSteelGradient(ctx: CanvasRenderingContext2D, y: number, height: number) {
    const grad = ctx.createLinearGradient(0, y - height, 0, y);
    grad.addColorStop(0.0, "#ffffff"); // white highlight top
    grad.addColorStop(0.15, "#dcdcdc"); // light silver
    grad.addColorStop(0.3, "#a0a0a0"); // medium gray
    grad.addColorStop(0.45, "#f8f8f8"); // bright streak
    grad.addColorStop(0.6, "#7a7a7a"); // darker metal
    grad.addColorStop(0.8, "#c8c8c8"); // light gray again
    grad.addColorStop(1.0, "#5a5a5a"); // bottom shadow
    return grad;
  }

  drawTitle(text: string, fontSize: number, x: number, y: number) {
    const ctx = this.context;
    const shadowColor = "#0a0601";

    // Main Text
    ctx.save();
    ctx.font = `bold ${fontSize - 1}px "Courier New"`;
    ctx.strokeStyle = shadowColor;
    ctx.fillStyle = shadowColor;
    ctx.textAlign = "center";
    ctx.strokeText(text, x, y + 2);
    ctx.fillText(text, x, y + 2);
    ctx.font = `bold ${fontSize}px "Courier New"`;
    ctx.fillStyle = this.getGoldGradient(ctx, y);
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

  drawMenuAction(text: string, delta: number, y: number = 200) {
    this.blinkTimer += delta;

    if (this.blinkTimer >= this.menuActionBlinkSpeed) {
      // 1 second toggle
      this.blinkTimer = 0;
      this.showMenuAction = !this.showMenuAction;
    }

    if (this.showMenuAction) {
      const ctx = this.context;
      const fontSize = 16;

      ctx.save();
      ctx.font = `bold ${fontSize}px "Courier New", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Fill text with gradient
      ctx.strokeStyle = "#161616ff";
      ctx.strokeText(text, ctx.canvas.width / 2, y + 1);
      ctx.fillStyle = this.getSteelGradient(ctx, y, 10);
      ctx.fillText(text, ctx.canvas.width / 2, y);

      ctx.restore();
    }
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

  getCenterX() {
    return drawEngine.context.canvas.width / 2;
  }
}

export const drawEngine = new DrawController();
