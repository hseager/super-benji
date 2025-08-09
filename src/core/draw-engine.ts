export const logicalWidth = 144; // base logical resolution
export const logicalHeight = 256; // base logical resolution

class DrawEngine {
  context: CanvasRenderingContext2D;
  mousePosition: DOMPoint;
  isPointerDown: boolean = false;

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

  drawTitle(text: string, fontSize: number, x: number, y: number) {
    const context = this.context;

    const fontColor = "#ed9436";
    const shadowColor = "#3f2163";

    // Main Text
    context.save();
    context.font = `bold ${fontSize - 1}px "Courier New"`;
    context.strokeStyle = shadowColor;
    context.textAlign = "center";
    context.strokeText(text, x, y + 1);
    context.font = `bold ${fontSize}px "Courier New"`;
    context.fillStyle = fontColor;
    context.fillText(text, x, y);
    context.restore();
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
    context.font = `${fontSize}px "Courier New"`;
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
}

export const drawEngine = new DrawEngine();
